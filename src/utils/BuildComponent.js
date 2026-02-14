const HTML_CACHE = new Map();

async function loadHTML(path) {
    if (HTML_CACHE.has(path)) return HTML_CACHE.get(path);

    const html = await fetch(path).then(res => res.text());
    const template = document.createElement("template");

    template.innerHTML = html;

    HTML_CACHE.set(path, template);

    return template;
}

export default class BuildComponent {
    #template = document.createElement("template");
    #stylesheets = [];
    #ready = false;
    #initPromise = null;

    constructor({ css = null, html = null }) {
        this.css = css;
        this.html = html;

        this.#initPromise = this.#_init();
    }

    async #_init() {
        await this.#_loadCSS();
        await this.#_loadHTML();

        this.#ready = true;
    }

    async #_loadCSS() {
        if (!this.css) return;

        const list = Array.isArray(this.css) ? this.css : [this.css];

        for (const css of list) {
            if (css instanceof CSSStyleSheet) {
                this.#stylesheets.push(css);

                continue;
            }

            if (typeof css === "string") {
                const stylesheet = new CSSStyleSheet();

                stylesheet.replaceSync(css);
                this.#stylesheets.push(stylesheet);

                continue;
            }

            throw new Error("CSS must be a string, a CSSStyleSheet, or an array containing either.");
        }
    }

    async #_loadHTML() {
        if (!this.html) return;

        if (typeof this.html === "string" && !this.html.endsWith(".html")) {
            this.#template.innerHTML = this.html;

            if (!this.#template.content.hasChildNodes()) {
                console.warn(`[BuildComponent] No markup found in HTML template: ${this.html}`);
            }

            return;
        }

        if (typeof this.html === "string" && this.html.endsWith(".html")) {
            const tpl = await loadHTML(this.html);

            this.#template.content.append(tpl.content.cloneNode(true));

            if (!this.#template.content.hasChildNodes()) {
                console.warn(`[BuildComponent] No markup found in HTML template: ${this.html}`);
            }

            return;
        }

        throw new TypeError("HTML must be a string or a '.html' file path.");
    }

    get component() {
        return async root => {
            if (!this.#ready) await this.#initPromise;

            root.adoptedStyleSheets = this.#stylesheets;
            root.appendChild(this.#template.content.cloneNode(true));
        }
    }
}