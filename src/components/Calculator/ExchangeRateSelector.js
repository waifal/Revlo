/**
 *     _____         _                              _____      _           _               _____                                              _   
 *    |  ___|       | |                            /  ___|    | |         | |             /  __ \                                            | |  
 *    | |____  _____| |__   __ _ _ __   __ _  ___  \ `--.  ___| | ___  ___| |_ ___  _ __  | /  \/ ___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_ 
 *    |  __\ \/ / __| '_ \ / _` | '_ \ / _` |/ _ \  `--. \/ _ \ |/ _ \/ __| __/ _ \| '__| | |    / _ \| '_ ` _ \| '_ \ / _ \| '_ \ / _ \ '_ \| __|
 *    | |___>  < (__| | | | (_| | | | | (_| |  __/ /\__/ /  __/ |  __/ (__| || (_) | |    | \__/\ (_) | | | | | | |_) | (_) | | | |  __/ | | | |_ 
 *    \____/_/\_\___|_| |_|\__,_|_| |_|\__, |\___| \____/ \___|_|\___|\___|\__\___/|_|     \____/\___/|_| |_| |_| .__/ \___/|_| |_|\___|_| |_|\__|
 *                                      __/ |                                                                   | |                               
 *                                     |___/                                                                    |_|                               
 * Last Modified: 2026-02-15
 */

// Component CSS
import TailwindCSS      from "/src/assets/css/output.css" with { type: "css" };

// Utilities
import BuildComponent   from "./../../utils/BuildComponent.js";
import FetchResource    from "./../../utils/FetchResource.js";

const customCSS = `
    .no-scrollbar::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }
    .no-scrollbar {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;     /* Firefox */
    }
`;

const template = new BuildComponent({
    css: [TailwindCSS, customCSS],
    html: "./src/components/Calculator/ExchangeRateSelector.html"
});

class ExchangeRateSelector extends HTMLElement {
    constructor() {
        super();
        this._root = this.attachShadow({ mode: "closed" });
        template.component(this._root).then(() => this.#_render());
    }

    #notifyChange() {
        this.dispatchEvent(new CustomEvent("rate-change", {
            detail: { rate: this.dataset.exchangeRate },
            bubbles: true,
            composed: true
        }));
    }

    async #_fetchRates() {
        const data = await FetchResource("./src/config/config.json");
        this._exchangeRates = data.Currencies.ExchangeRates[0];
        this._baseCurrency  = data.Currencies.BaseCurrency;
        this._countries     = Object.keys(this._exchangeRates).sort((a, b) => a.localeCompare(b));
    }

    #_buildDropdown() {
        const $container    = this._root.querySelector(".custom-select");
        const $selected     = $container.querySelector(".selected");
        const $list         = $container.querySelector(".options");

        $list.innerHTML = "";

        this._countries.forEach(country => {
            const li = document.createElement("li");
            li.className        = "px-3 py-2 flex items-center hover:bg-slate-800 cursor-pointer";
            li.dataset.value    = this._exchangeRates[country].toFixed(2);
            li.dataset.code     = country;

            const svgPath       = `/src/assets/imgs/flags/${country.toLowerCase()}.svg`;
            li.innerHTML        = `
                <img src="${svgPath}" class="w-5 h-3">
                <span class="px-2">${country}</span>
            `;
            $list.appendChild(li);
        });

        const initial               = this._exchangeRates[this._baseCurrency] ? this._baseCurrency : this._countries[0];
        this.dataset.exchangeRate   = this._exchangeRates[initial].toFixed(2);
        $selected.innerHTML         = `
            <img src="/src/assets/imgs/flags/${initial.toLowerCase()}.svg" class="w-5 h-3">
            <span class="px-2">${initial}</span>
        `;

        return { $container, $selected, $list };
    }

    #_bindEvents({ $container, $selected, $list }) {
        // Toggle dropdown
        $selected.addEventListener("click", e => {
            e.stopPropagation();
            $list.classList.toggle("hidden");
        });

        // Outside click
        document.addEventListener("click", e => {
            if (!e.composedPath().includes(this)) $list.classList.add("hidden");
        });

        // Option click
        const options = Array.from($list.querySelectorAll("li"));
        options.forEach(li => {
            li.setAttribute("tabindex", "-1");
            li.addEventListener("click", () => {
                this.dataset.exchangeRate = li.dataset.value;
                
                $selected.innerHTML = li.innerHTML;
                $list.classList.add("hidden");
                
                this.#notifyChange();
            });
        });

        return options;
    }

    #_bindKeyboard({ $selected, $list, options }) {
        let focusedIndex = -1;
        let lastTypedChar = "";
        let lastMatchIndex = -1;

        $selected.setAttribute("tabindex", "0");

        // Selected key handling
        $selected.addEventListener("keydown", e => {
            const key = e.key;
            switch (key) {
                case "ArrowDown":
                    e.preventDefault(); focusedIndex = 0;
                    options[focusedIndex].focus();
                    break;
                case "ArrowUp":
                    e.preventDefault(); focusedIndex = options.length - 1;
                    options[focusedIndex].focus();
                    break;
                case "Enter":
                case " ":
                    e.preventDefault();
                    $list.classList.toggle("hidden");
                    break;
                case "Escape":
                    e.preventDefault();
                    $list.classList.add("hidden");
                    break;
            }
        });

        // Option key handling
        options.forEach((li, idx) => {
            li.addEventListener("keydown", e => {
                const key = e.key;
                if (key === "ArrowDown") {
                    e.preventDefault();
                    focusedIndex = (idx + 1) % options.length; 
                    options[focusedIndex].focus();
                } else if (key === "ArrowUp") {
                    e.preventDefault();
                    focusedIndex = (idx - 1 + options.length) % options.length; 
                    options[focusedIndex].focus();
                } else if (key === "Enter" || key === " ") {
                    e.preventDefault(); li.click();
                } else if (key === "Escape") {
                    e.preventDefault(); $list.classList.add("hidden"); 
                    $selected.focus();
                } else if (key.length === 1) {
                    // Type-ahead with cycling
                    const char = key.toUpperCase();
                    const matches = options.map((o, i) => ({ o, i })).filter(o => o.o.textContent.trim().startsWith(char));

                    if (matches.length > 0) {
                        let match;

                        if (char === lastTypedChar) {
                            const current = matches.findIndex(o => o.i === lastMatchIndex);
                            
                            match = matches[(current + 1) % matches.length];
                        } else match = matches[0];

                        focusedIndex = match.i;
                        options[focusedIndex].focus();
                        lastTypedChar = char;
                        lastMatchIndex = focusedIndex;
                    }
                }
            });
        });
    }

    async #_render() {
        await this.#_fetchRates();
        
        const elements = this.#_buildDropdown();
        const options = this.#_bindEvents(elements);

        this.#_bindKeyboard({ ...elements, options });
        this.#notifyChange();
    }
}

customElements.define("exchange-rate-selector", ExchangeRateSelector);
