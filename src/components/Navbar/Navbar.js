/**
 *      _   _             _                   _____                                             _   
 *     | \ | |           | |                 / ____|                                           | |  
 *     |  \| | __ ___   _| |__   __ _ _ __  | |     ___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_ 
 *     | . ` |/ _` \ \ / / '_ \ / _` | '__| | |    / _ \| '_ ` _ \| '_ \ / _ \| '_ \ / _ \ '_ \| __|
 *     | |\  | (_| |\ V /| |_) | (_| | |    | |___| (_) | | | | | | |_) | (_) | | | |  __/ | | | |_ 
 *     |_| \_|\__,_| \_/ |_.__/ \__,_|_|     \_____\___/|_| |_| |_| .__/ \___/|_| |_|\___|_| |_|\__|
 *                                                                | |                               
 *                                                                |_|                               
 *
 * Last Modified: 2026-02-14
 */

// Component CSS
import TailwindCSS from "/src/assets/css/output.css" with { type: "css" };

// Utilities
import BuildComponent from "./../../utils/BuildComponent.js";

const template = new BuildComponent({
    css: [TailwindCSS],
    html: "./src/components/Navbar/Navbar.html"
});

class Navbar extends HTMLElement {
    constructor() {
        super();

        this._root = this.attachShadow({ mode: "closed" });
        template.component(this._root);
    }
}

customElements.define("app-nav-bar", Navbar);