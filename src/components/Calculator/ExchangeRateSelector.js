/**
 *     _____         _                              _____      _           _               _____                                              _   
 *    |  ___|       | |                            /  ___|    | |         | |             /  __ \                                            | |  
 *    | |____  _____| |__   __ _ _ __   __ _  ___  \ `--.  ___| | ___  ___| |_ ___  _ __  | /  \/ ___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_ 
 *    |  __\ \/ / __| '_ \ / _` | '_ \ / _` |/ _ \  `--. \/ _ \ |/ _ \/ __| __/ _ \| '__| | |    / _ \| '_ ` _ \| '_ \ / _ \| '_ \ / _ \ '_ \| __|
 *    | |___>  < (__| | | | (_| | | | | (_| |  __/ /\__/ /  __/ |  __/ (__| || (_) | |    | \__/\ (_) | | | | | | |_) | (_) | | | |  __/ | | | |_ 
 *    \____/_/\_\___|_| |_|\__,_|_| |_|\__, |\___| \____/ \___|_|\___|\___|\__\___/|_|     \____/\___/|_| |_| |_| .__/ \___/|_| |_|\___|_| |_|\__|
 *                                      __/ |                                                                   | |                               
 *                                     |___/                                                                    |_|                               
 * Last Modified: 2026-02-17
 */

// Component CSS
import TailwindCSS from "/src/assets/css/output.css" with { type: "css" };

// Utilities
import BuildComponent from "./../../utils/BuildComponent.js";
import FetchResource from "./../../utils/FetchResource.js";

const customCSS = `
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
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
        this._baseCurrency = data.Currencies.BaseCurrency;
        this._countries = Object.keys(this._exchangeRates)
            .sort((a, b) => a.localeCompare(b));
    }

    #_buildDropdown() {
        const $container = this._root.querySelector(".custom-select");
        const $selected = $container.querySelector(".selected");
        const $list = $container.querySelector(".options");

        const listId = "exchange-rate-listbox";

        // ---- Trigger Accessibility ----
        $selected.setAttribute("role", "button");
        $selected.setAttribute("tabindex", "0");
        $selected.setAttribute("aria-haspopup", "listbox");
        $selected.setAttribute("aria-expanded", "false");
        $selected.setAttribute("aria-controls", listId);
        $selected.setAttribute("aria-label", "Select base currency");

        // ---- List Accessibility ----
        $list.id = listId;
        $list.setAttribute("role", "listbox");
        $list.setAttribute("tabindex", "-1");

        $list.innerHTML = "";

        this._countries.forEach(country => {
            const li = document.createElement("li");

            li.className =
                "px-3 py-2 flex items-center hover:bg-slate-800 cursor-pointer";

            li.dataset.value = this._exchangeRates[country].toFixed(2);
            li.dataset.code = country;

            li.setAttribute("role", "option");
            li.setAttribute("aria-selected", "false");
            li.setAttribute("tabindex", "-1");
            li.id = `exchange-option-${country}`;

            const svgPath =
                `/src/assets/imgs/flags/${country.toLowerCase()}.svg`;

            li.innerHTML = `
                <img src="${svgPath}" class="w-5 h-3" alt="">
                <span class="px-2">${country}</span>
            `;

            $list.appendChild(li);
        });

        // ---- Initial Selection ----
        const initial =
            this._exchangeRates[this._baseCurrency]
                ? this._baseCurrency
                : this._countries[0];

        this.dataset.exchangeRate =
            this._exchangeRates[initial].toFixed(2);

        const $initialOption =
            $list.querySelector(`[data-code="${initial}"]`);

        if ($initialOption) {
            $initialOption.setAttribute("aria-selected", "true");
            $initialOption.setAttribute("tabindex", "0");
            $selected.setAttribute(
                "aria-activedescendant",
                $initialOption.id
            );
        }

        $selected.innerHTML = `
            <img src="/src/assets/imgs/flags/${initial.toLowerCase()}.svg" class="w-5 h-3" alt="">
            <span class="px-2">${initial}</span>
        `;

        return { $container, $selected, $list };
    }

    #_bindEvents({ $selected, $list }) {

        const open = () => {
            $list.classList.remove("hidden");
            $selected.setAttribute("aria-expanded", "true");
        };

        const close = () => {
            $list.classList.add("hidden");
            $selected.setAttribute("aria-expanded", "false");
        };

        const toggle = () => {
            const expanded =
                $selected.getAttribute("aria-expanded") === "true";
            expanded ? close() : open();
        };

        // Toggle dropdown
        $selected.addEventListener("click", e => {
            e.stopPropagation();
            toggle();
        });

        // Outside click
        document.addEventListener("click", e => {
            if (!e.composedPath().includes(this)) close();
        });

        const options =
            Array.from($list.querySelectorAll('[role="option"]'));

        options.forEach(li => {
            li.addEventListener("click", () => {

                this.dataset.exchangeRate = li.dataset.value;

                options.forEach(opt => {
                    opt.setAttribute("aria-selected", "false");
                    opt.setAttribute("tabindex", "-1");
                });

                li.setAttribute("aria-selected", "true");
                li.setAttribute("tabindex", "0");

                $selected.setAttribute(
                    "aria-activedescendant",
                    li.id
                );

                $selected.innerHTML = li.innerHTML;

                close();
                $selected.focus();

                this.#notifyChange();
            });
        });

        return options;
    }

    #_bindKeyboard({ $selected, $list, options }) {

        const open = () => {
            $list.classList.remove("hidden");
            $selected.setAttribute("aria-expanded", "true");
        };

        const close = () => {
            $list.classList.add("hidden");
            $selected.setAttribute("aria-expanded", "false");
        };

        let focusedIndex =
            options.findIndex(o =>
                o.getAttribute("aria-selected") === "true"
            );

        let lastTypedChar = "";
        let lastMatchIndex = -1;

        // Trigger keyboard
        $selected.addEventListener("keydown", e => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    open();
                    focusedIndex =
                        (focusedIndex + 1) % options.length;
                    options[focusedIndex].focus();
                    break;

                case "ArrowUp":
                    e.preventDefault();
                    open();
                    focusedIndex =
                        (focusedIndex - 1 + options.length) %
                        options.length;
                    options[focusedIndex].focus();
                    break;

                case "Enter":
                case " ":
                    e.preventDefault();
                    open();
                    break;

                case "Escape":
                    e.preventDefault();
                    close();
                    break;
            }
        });

        // Option keyboard
        options.forEach((li, idx) => {
            li.addEventListener("keydown", e => {

                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    options[(idx + 1) % options.length].focus();
                }

                if (e.key === "ArrowUp") {
                    e.preventDefault();
                    options[
                        (idx - 1 + options.length) %
                        options.length
                    ].focus();
                }

                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    li.click();
                }

                if (e.key === "Escape") {
                    e.preventDefault();
                    close();
                    $selected.focus();
                }

                // Type-ahead support
                if (e.key.length === 1) {
                    const char = e.key.toUpperCase();

                    const matches =
                        options.map((o, i) => ({ o, i }))
                        .filter(o =>
                            o.o.textContent
                                .trim()
                                .startsWith(char)
                        );

                    if (matches.length > 0) {
                        let match;

                        if (char === lastTypedChar) {
                            const current =
                                matches.findIndex(
                                    o => o.i === lastMatchIndex
                                );

                            match =
                                matches[(current + 1) %
                                    matches.length];
                        } else {
                            match = matches[0];
                        }

                        options[match.i].focus();

                        lastTypedChar = char;
                        lastMatchIndex = match.i;
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