/**
 *      _____                 _ _         _______    _     _         _____                                             _   
 *     |  __ \               | | |       |__   __|  | |   | |       / ____|                                           | |  
 *     | |__) |___  ___ _   _| | |_ ___     | | __ _| |__ | | ___  | |     ___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_ 
 *     |  _  // _ \/ __| | | | | __/ __|    | |/ _` | '_ \| |/ _ \ | |    / _ \| '_ ` _ \| '_ \ / _ \| '_ \ / _ \ '_ \| __|
 *     | | \ \  __/\__ \ |_| | | |_\__ \    | | (_| | |_) | |  __/ | |___| (_) | | | | | | |_) | (_) | | | |  __/ | | | |_ 
 *     |_|  \_\___||___/\__,_|_|\__|___/    |_|\__,_|_.__/|_|\___|  \_____\___/|_| |_| |_| .__/ \___/|_| |_|\___|_| |_|\__|
 *                                                                                       | |                               
 *                                                                                       |_|                               
 * Last Modified: 2026-02-15
 */

// Component CSS
import TailwindCSS from "/src/assets/css/output.css" with { type: "css" };

// Utilities
import BuildComponent from "../../utils/BuildComponent.js";
import formatCurrency from "../../utils/FormatCurrency.js";

const customCSS = `
    :host {
        display: contents;
    }
`;

const template = new BuildComponent({
    css: [TailwindCSS, customCSS],
    html: "./src/components/Calculator/ResultsTable.html"
});

class ResultsTable extends HTMLElement {
    constructor() {
        super();

        // Root
        this._root = this.attachShadow({ mode: "closed" });
        template.component(this._root).then(() => this.#_init());

        // Formatter
        this.format = (amount, locales = undefined, currency = undefined) => formatCurrency(amount, locales, currency);
        
        // Iterator
        this.populateFields = (fields, value, isProfit = false) => {
            if (!fields.forEach) fields = [fields];

            fields.forEach(f => {
                const amount = Number(value);
                f.textContent = this.format(amount);

                if (isProfit) {
                    f.classList.remove("text-slate-400", "text-green-400", "text-red-500");

                    if (amount > 0) {
                        f.classList.add("text-green-400");
                    } else if (amount < 0) {
                        f.classList.add("text-red-500");
                    } else {
                        f.classList.add("text-slate-400");
                    }
                }
            });
        };
    }

    #_init() {
        // Queries
        this.convertedCost  = this._root.querySelectorAll("[data-converted-cost]");
        this.minimumPrice   = this._root.querySelector("[data-minimum-price]");
        this.revenue        = this._root.querySelectorAll("[data-revenue]");
        this.totalProfit    = this._root.querySelectorAll("[data-total-profit]");
        this.reinvestment   = this._root.querySelector("[data-reinvestment]");
        this.float          = this._root.querySelector("[data-float]");
        this.personalProfit = this._root.querySelector("[data-personal-profit]");
    }

    updateConvertedCost(value) {
        this.populateFields(this.convertedCost, value);
    }

    updateMinimumPrice(value) {
        this.minimumPrice.textContent = this.format(Number(value));
    }

    updateTotalProfit(value) {
        this.populateFields(this.totalProfit, value, true);
    }

    updateRevenue(value) {
        this.populateFields(this.revenue, value);
    }

    updateReinvestment(value) {
        this.reinvestment.textContent = this.format(Number(value));
    }

    updateFloat(value) {
        this.float.textContent = this.format(Number(value));
    }

    updatePersonalProfit(value) {
        this.personalProfit.textContent = this.format(Number(value));
    }
}

customElements.define("app-results-table", ResultsTable);