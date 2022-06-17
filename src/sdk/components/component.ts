export abstract class BaseComponent {

    protected layout: HTMLDivElement | null;

    constructor() {
        this.layout = null;
    }

    isVisible() {
        return this.layout != null;
    }

    removeFromDom() {
        if (!this.layout) {
            return;
        }
        this.body.removeChild(this.layout);
        this.layout = null;
    }

    protected get body(): HTMLBodyElement {
        return document.getElementsByTagName("body")[0];
    }

    abstract get html(): string;

    abstract appendToDom(): void;
}