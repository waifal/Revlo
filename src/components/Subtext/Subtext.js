/**
 *       _____       _     _            _      _____                                             _   
 *      / ____|     | |   | |          | |    / ____|                                           | |  
 *     | (___  _   _| |__ | |_ _____  _| |_  | |     ___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_ 
 *      \___ \| | | | '_ \| __/ _ \ \/ / __| | |    / _ \| '_ ` _ \| '_ \ / _ \| '_ \ / _ \ '_ \| __|
 *      ____) | |_| | |_) | ||  __/>  <| |_  | |___| (_) | | | | | | |_) | (_) | | | |  __/ | | | |_ 
 *     |_____/ \__,_|_.__/ \__\___/_/\_\\__|  \_____\___/|_| |_| |_| .__/ \___/|_| |_|\___|_| |_|\__|
 *                                                                 | |                               
 *                                                                 |_|                               
 * Last Modified: 2026-02-15
 */
// Component CSS
import TailwindCSS from "/src/assets/css/output.css" with { type: "css" };

// Utilities
import BuildComponent from "./../../utils/BuildComponent.js";

const template = new BuildComponent({
    css: [TailwindCSS],
    html: "./src/components/Subtext/Subtext.html"
});

class Subtext extends HTMLElement {
    constructor() {
        super();

        this._root = this.attachShadow({ mode: "closed" });
        template.component(this._root).then(() => this.#_render());
    }

    #_render() {
        // Query
        const p = this._root.querySelector("p");
        
        p.textContent = this.getAttribute("text") || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt sequi necessitatibus omnis, at possimus soluta.";
    }
}

customElements.define("app-subtext", Subtext);