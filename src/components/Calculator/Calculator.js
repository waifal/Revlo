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
        template.component(this._root).then(() => this.#_init());

        // Formatter
        this.format = (amount, locales = null, currency = null) => formatCurrency(amount);
    }

    get convertedCost() {
        const cost = Number(this.$cost.value);
        const rate = Number(this.$exchangeRate.value);
        return cost && rate ? cost * rate : 0;
    }

    get minimumPrice() {
        return 2 * this.convertedCost;
    }

    get revenue() {
        return Number(this.$revenue.value);
    }

    get totalProfit() {
        return this.revenue - this.convertedCost;
    }

    get revinvestment() {
        return 0.50 * this.totalProfit;
    }

    get float() {
        return 0.30 * this.totalProfit;
    }

    get personalProfit() {
        return 0.20 * this.totalProfit;
    }


    #_init() {
        // Queries
        this.$cost              = this._root.querySelector("#cost");
        this.$exchangeRate      = this._root.querySelector("#exchangeRate");
        this.$revenue           = this._root.querySelector("#estSale");

        this.#_render();
    }

    #_handleCalculateButton() {
        const cost            = this._root.getElementById("cost");
        const exchangeRate    = this._root.getElementById("exchangeRate");
        const estSale         = this._root.getElementById("estSale");
        this.$calculateButton = this._root.querySelector("button");

        const handleMissingInputValue = (fields) => {
            let hasMissing = false;
            Object.entries(fields).forEach(([name, value]) => {
                if (!value) {
                    console.warn(`[Calculator Form] "${name}" is missing or invalid!`);
                    hasMissing = true;
                }
            });
            return hasMissing;
        };

        [cost, exchangeRate, estSale].forEach(el => {
            el.onkeydown = e => {
                const invalidKeys = ["E", "e", "-", "."];

                if(invalidKeys.includes(e.key)) e.preventDefault();

                e.key === "Enter" ? this.$calculateButton.click() : null;
            }

            el.onpaste = e => e.preventDefault();
        });

        this.$calculateButton.onclick = () => {
            const [cost, exchangeRate, revenue] = [
                this.$cost.value,
                this.$exchangeRate.value,
                this.$revenue.value
            ];

            const isMissing = handleMissingInputValue({ 
                Cost: cost, 
                "Exchange Rate": exchangeRate, 
                Revenue: revenue 
            });

            if (isMissing) return;

            const resultsTable = document.querySelector("app-results-table");

            resultsTable.updateConvertedCost(this.convertedCost);
            resultsTable.updateMinimumPrice(this.minimumPrice);
            resultsTable.updateTotalProfit(this.totalProfit);
            resultsTable.updateRevenue(this.revenue);
            resultsTable.updateReinvestment(this.revinvestment);
            resultsTable.updateFloat(this.float);
            resultsTable.updatePersonalProfit(this.personalProfit);
        };
    }

    #_handleExchangeRateSelection() {
        const exchangeRateSelect = this._root.querySelector("exchange-rate-selector");
            
        exchangeRateSelect.addEventListener("rate-change", e => {
            this.exchangeRate = parseFloat(e.detail.rate).toFixed(2);

            this.$exchangeRate.value = this.exchangeRate;
        });
    }

    #_render() {
        this.#_handleExchangeRateSelection();
        this.#_handleCalculateButton();
    }
}

customElements.define("app-calculator", Calculator);