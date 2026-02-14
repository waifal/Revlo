/**
 *      ______         _                    _____                   _____                                             _   
 *     |  ____|       | |                  |_   _|                 / ____|                                           | |  
 *     | |__ ___  __ _| |_ _   _ _ __ ___    | |  ___ ___  _ __   | |     ___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_ 
 *     |  __/ _ \/ _` | __| | | | '__/ _ \   | | / __/ _ \| '_ \  | |    / _ \| '_ ` _ \| '_ \ / _ \| '_ \ / _ \ '_ \| __|
 *     | | |  __/ (_| | |_| |_| | | |  __/  _| || (_| (_) | | | | | |___| (_) | | | | | | |_) | (_) | | | |  __/ | | | |_ 
 *     |_|  \___|\__,_|\__|\__,_|_|  \___| |_____\___\___/|_| |_|  \_____\___/|_| |_| |_| .__/ \___/|_| |_|\___|_| |_|\__|
 *                                                                                      | |                               
 *                                                                                      |_|                               
 * Last Modified: 14-02-2026 
 */

// Component CSS
import TailwindCSS from "/src/assets/css/output.css" with { type: "css" };

// Utilities
import BuildComponent from "../../utils/BuildComponent.js";

const template = new BuildComponent({
    css: [TailwindCSS],
    html: "./src/components/FeatureIcon/FeatureIcon.html"
});

class FeatureIcon extends HTMLElement {
    constructor() {
        super();

        this._root = this.attachShadow({ mode: "closed" });
        template.component(this._root).then(() => this.#_render());

        this.defaults = {
            img: {
                "src": "./src/assets/imgs/feature-icon/placeholder.png",
                "alt": "Placeholder"
            },
            title: "Feature Icon",
            desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut saepe hic, obcaecati officia incidunt aliquid."
        }
    }

    #_render() {
        // Defaults
        const { img: { src, alt }, title, desc } = this.defaults;

        // Queries
        this.$icon  = this._root.querySelector("img");
        this.$title = this._root.querySelector("h3");
        this.$desc  = this._root.querySelector("p");

        // Logic
        this.$icon.src          = this.getAttribute("imgSrc") || src;
        this.$icon.alt          = this.getAttribute("imgAlt") || alt;
        this.$title.textContent = this.getAttribute("label")  || title;
        this.$desc.textContent  = this.getAttribute("desc")   || desc;
    }
}

customElements.define("app-feature-icon", FeatureIcon);