

export const VIDEO_MINIATURE_HTML_ID = "PalVideoMiniature";

export class PalVideoMiniature {

    private videoUrl: string;

    private radius: number;

    private onTap: Function;

    private layout?: HTMLDivElement | null;

    constructor(
        videoUrl: string,
        radius: number,
        onTap: Function,
    ) {
        this.videoUrl = videoUrl;
        this.radius = radius;
        this.onTap = onTap;
    }

    appendToDom() {
        this.layout = document.createElement("div");
        this.layout.id = VIDEO_MINIATURE_HTML_ID;
        this.layout.addEventListener("click", () => {
            this.onTap();
            this.removeFromDom();
        });
        this.layout.innerHTML = this.html;
        this.body?.appendChild(this.layout);
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

    private get body(): HTMLBodyElement {
        return document.getElementsByTagName("body")[0];
    }

    get html(): string {
        return `<div 
            class="content" 
            style="width: ${this.radius}px; height: ${this.radius}px;">
            <video 
                src="${this.videoUrl}"
                style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"
                width="${this.radius}" height="${this.radius}" autoplay loop muted
            ></video>
        </div>
        `;
    }
}