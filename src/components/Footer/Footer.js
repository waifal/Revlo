/**
 *      ______          _               _____                                             _   
 *     |  ____|        | |             / ____|                                           | |  
 *     | |__ ___   ___ | |_ ___ _ __  | |     ___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_ 
 *     |  __/ _ \ / _ \| __/ _ \ '__| | |    / _ \| '_ ` _ \| '_ \ / _ \| '_ \ / _ \ '_ \| __|
 *     | | | (_) | (_) | ||  __/ |    | |___| (_) | | | | | | |_) | (_) | | | |  __/ | | | |_ 
 *     |_|  \___/ \___/ \__\___|_|     \_____\___/|_| |_| |_| .__/ \___/|_| |_|\___|_| |_|\__|
 *                                                          | |                               
 *                                                          |_|                               
 * Last Mofified: 2026-02-15
 */

// Component CSS
import TailwindCSS from "/src/assets/css/output.css" with { type: "css" };

// Utilities
import BuildComponent from "./../../utils/BuildComponent.js";

const template = new BuildComponent({
    css: [TailwindCSS],
    html: "./src/components/Footer/Footer.html"
});

class Calculator extends HTMLElement {
    constructor() {
        super();

        // Root
        this._root = this.attachShadow({ mode: "closed" });
        template.component(this._root).then(() => this.#_render());
    }

    #_render() {
        // Queries
        const footerDate = this._root.querySelector("time");

        if (!footerDate) return;

        const startYear = 2026;
        const currentYear = new Date().getFullYear();

        footerDate.dateTime = currentYear.toString();
        footerDate.textContent = currentYear === startYear ? startYear : `${startYear} - ${currentYear}`;
    }
}

customElements.define("app-footer", Calculator);