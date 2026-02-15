/**
 *       _____      _            _       _                _____                                             _   
 *      / ____|    | |          | |     | |              / ____|                                           | |  
 *     | |     __ _| | ___ _   _| | __ _| |_ ___  _ __  | |     ___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_ 
 *     | |    / _` | |/ __| | | | |/ _` | __/ _ \| '__| | |    / _ \| '_ ` _ \| '_ \ / _ \| '_ \ / _ \ '_ \| __|
 *     | |___| (_| | | (__| |_| | | (_| | || (_) | |    | |___| (_) | | | | | | |_) | (_) | | | |  __/ | | | |_ 
 *      \_____\__,_|_|\___|\__,_|_|\__,_|\__\___/|_|     \_____\___/|_| |_| |_| .__/ \___/|_| |_|\___|_| |_|\__|
 *                                                                            | |                               
 *                                                                            |_|                               
 * Last Modified: 2026-02-14
 */

// Component CSS
import TailwindCSS from "/src/assets/css/output.css" with { type: "css" };

// Utilities
import BuildComponent from "./../../utils/BuildComponent.js";
import formatCurrency from "../../utils/FormatCurrency.js";

// Components
import "./ExchangeRateSelector.js";

const inputReset = `
    .no-spinner::-webkit-outer-spin-button,
    .no-spinner::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .no-spinner[type="number"] {
        -moz-appearance: textfield;
        apperance: textfield;
    }
`;

const customCSS = `
    :host {
        display: contents;
    }
`;

const template = new BuildComponent({
    css: [TailwindCSS, inputReset, customCSS],
    html: "./src/components/Calculator/Calculator.html"
});

class Calculator extends HTMLElement {
    constructor() {
        super();

        // Root
        this._root = this.attachShadow({ mode: "closed" });
        template.component(this._root).then(() => this.#_render());

        // Formatter
        this.format = (amount, locales = null, currency = null) => formatCurrency(amount);
    }

    get convertedCost() {
        return (this.cost * this.exchangeRate);
    }

    get minimumPrice() {
        return (2 * this.convertedCost);
    }

    #_render() {
        // Queries
        this.$cost           = this._root.querySelector("#cost");
        this.$exchangeRate   = this._root.querySelector("#exchangeRate");
        this.$revenue        = this._root.querySelector("#estSale");

        const exchangeRateSelect = this._root.querySelector("exchange-rate-selector");
        
        exchangeRateSelect.addEventListener("rate-change", e => {
            this.exchangeRate = parseFloat(e.detail.rate).toFixed(2);

            this.$exchangeRate.value = this.exchangeRate;
        });
    }
}

customElements.define("app-calculator", Calculator);