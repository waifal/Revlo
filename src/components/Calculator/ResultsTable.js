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

        this._root = this.attachShadow({ mode: "closed" });
        template.component(this._root).then(() => this.#_init());

        this.format = (amount, locales = undefined, currency = undefined) =>
            formatCurrency(amount, locales, currency);
    }

    #animateCurrency(elements, endValue, isProfit = false, duration = 500) {

        if (!elements.forEach) elements = [elements];

        elements.forEach(el => {

            if (el._animFrame) cancelAnimationFrame(el._animFrame);

            const startTime = performance.now();

            const step = (time) => {
                const progress = Math.min((time - startTime) / duration, 1);

                const eased = 1 - Math.pow(1 - progress, 3);
                const value = endValue * eased;

                el.textContent = this.format(value);

                if (progress < 1) {
                    el._animFrame = requestAnimationFrame(step);
                } else {
                    el.textContent = this.format(endValue);

                    if (isProfit) {
                        el.classList.remove(
                            "text-slate-400",
                            "text-green-400",
                            "text-red-500"
                        );

                        if (endValue > 0) {
                            el.classList.add("text-green-400");
                        } else if (endValue < 0) {
                            el.classList.add("text-red-500");
                        } else {
                            el.classList.add("text-slate-400");
                        }
                    }
                }
            };

            el._animFrame = requestAnimationFrame(step);
        });
    }

    #_init() {
        this.convertedCost  = this._root.querySelectorAll("[data-converted-cost]");
        this.minimumPrice   = this._root.querySelector("[data-minimum-price]");
        this.revenue        = this._root.querySelectorAll("[data-revenue]");
        this.totalProfit    = this._root.querySelectorAll("[data-total-profit]");
        this.reinvestment   = this._root.querySelector("[data-reinvestment]");
        this.float          = this._root.querySelector("[data-float]");
        this.personalProfit = this._root.querySelector("[data-personal-profit]");
    }

    updateConvertedCost(value) {
        this.#animateCurrency(this.convertedCost, Number(value));
    }

    updateMinimumPrice(value) {
        this.#animateCurrency(this.minimumPrice, Number(value));
    }

    updateTotalProfit(value) {
        this.#animateCurrency(this.totalProfit, Number(value), true);
    }

    updateRevenue(value) {
        this.#animateCurrency(this.revenue, Number(value));
    }

    updateReinvestment(value) {
        this.#animateCurrency(this.reinvestment, Number(value));
    }

    updateFloat(value) {
        this.#animateCurrency(this.float, Number(value));
    }

    updatePersonalProfit(value) {
        this.#animateCurrency(this.personalProfit, Number(value));
    }
}

customElements.define("app-results-table", ResultsTable);