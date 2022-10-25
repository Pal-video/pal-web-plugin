import { BaseComponent } from "../component";


export const VIDEO_MINIATURE_HTML_ID = "PalVideoMiniature";

export class PalVideoMiniature extends BaseComponent {

    private videoUrl: string;

    private radius: number;

    private onTap: Function;

    constructor(
        videoUrl: string,
        radius: number,
        onTap: Function,
    ) {
        super();
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

    get html(): string {
        return `<div class="content">
            <video 
                src="${this.videoUrl}"
                autoplay loop muted
            ></video>
        </div>
        <div class="palAnimatedBg"></div>
        <div class="palAnimatedBg2"></div>
        `;
    }

    static removeAny() {
        let layout = document.getElementById(VIDEO_MINIATURE_HTML_ID);
        if (!layout) {
            return;
        }
        let body = document.getElementsByTagName("body")[0];
        body.removeChild(layout);
    }
}