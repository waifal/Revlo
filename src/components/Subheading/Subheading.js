/**
 *       _____       _     _                    _ _                _____                                             _   
 *      / ____|     | |   | |                  | (_)              / ____|                                           | |  
 *     | (___  _   _| |__ | |__   ___  __ _  __| |_ _ __   __ _  | |     ___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_ 
 *      \___ \| | | | '_ \| '_ \ / _ \/ _` |/ _` | | '_ \ / _` | | |    / _ \| '_ ` _ \| '_ \ / _ \| '_ \ / _ \ '_ \| __|
 *      ____) | |_| | |_) | | | |  __/ (_| | (_| | | | | | (_| | | |___| (_) | | | | | | |_) | (_) | | | |  __/ | | | |_ 
 *     |_____/ \__,_|_.__/|_| |_|\___|\__,_|\__,_|_|_| |_|\__, |  \_____\___/|_| |_| |_| .__/ \___/|_| |_|\___|_| |_|\__|
 *                                                         __/ |                       | |                               
 *                                                        |___/                        |_|                               
 * Last Modified: 2026-02-15
 */

// Component CSS
import TailwindCSS from "/src/assets/css/output.css" with { type: "css" };

// Utilities
import BuildComponent from "./../../utils/BuildComponent.js";

const customCSS = `
    :host {
        display: block;
    }
`;

const template = new BuildComponent({
    css: [TailwindCSS, customCSS],
    html: "./src/components/Subheading/Subheading.html"
});

class Subheading extends HTMLElement {
    constructor() {
        super();

        this._root = this.attachShadow({ mode: "closed" });
        template.component(this._root).then(() => this.#_render());
    }

    #_render() {
        // Query
        const h2 = this._root.querySelector("h2");
        
        h2.textContent = this.getAttribute("label") || "Subheading";
    }
}

customElements.define("app-subheading", Subheading);