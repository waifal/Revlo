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
        template.component(this._root);
    }
}

customElements.define("app-results-table", ResultsTable);