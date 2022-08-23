import { PalBrand } from "../branding/pal_brand";
import { BaseComponent, Component } from "../component";

export const VIDEO_EXPANDED_HTML_ID = "PalVideoExpanded";

export const VIDEO_SKIP_BTN_HTML_CLASS = "PalVideoExpandedSkipBtn";

export const VIDEO_ID = "PalVideoPlayer";

export type VideoListener = (videoExpanded: PalVideoExpanded) => void;

export class PalVideoExpanded extends BaseComponent {

    private videoUrl: string;

    private onSkipTap: Function;

    private onVideoEnd: VideoListener;

    private closeOnEnd: boolean;

    private content?: Component;

    constructor(
        videoUrl: string,
        onSkipTap: Function,
        onVideoEnd: VideoListener,
        closeOnEnd: boolean,
        content?: Component,
    ) {
        super();
        this.videoUrl = videoUrl;
        this.onSkipTap = onSkipTap;
        this.onVideoEnd = onVideoEnd;
        this.closeOnEnd = closeOnEnd;
        this.content = content;
    }


    appendToDom(): void {
        this.layout = document.createElement("div");
        this.layout.id = VIDEO_EXPANDED_HTML_ID;
        this.layout.innerHTML = this.html;
        this.body?.appendChild(this.layout);

        const skipButton = document.getElementsByClassName(VIDEO_SKIP_BTN_HTML_CLASS)[0] as HTMLButtonElement;
        const video = document.getElementById(VIDEO_ID) as HTMLVideoElement;
        skipButton.addEventListener("click", () => {
            this.onSkipTap();
            this.removeFromDom();
        });
        video.onended = (_) => {
            this.onVideoEnd(this);
            if (this.closeOnEnd) {
                this.removeFromDom();
            }
        };
        video.play();
    }

    replaceContent(component: Component): void {
        let innerLayoutContent = document.getElementsByClassName("inner-content")[0];
        innerLayoutContent.innerHTML = component.html;
    }

    get html(): string {
        return `<div 
            class="content" 
            style="">
            <button class="palBtn ${VIDEO_SKIP_BTN_HTML_CLASS}">
                ${this.closeIcon}
            </button>
            <video 
                id="${VIDEO_ID}"
                src="${this.videoUrl}"
            ></video>
            <div class="inner-content">
                ${this.content?.html}
            </div>
            ${new PalBrand().html}
        </div>`;
    }

    get closeIcon(): string {
        return `<svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.9067 16c-.48828 0-.97656-.1856-1.34785-.5595-.74513-.7451-.74513-1.9505 0-2.6956L12.7455.55883c.7451-.7451 1.9505-.7451 2.6957 0 .7451.7451.7451 1.95049 0 2.69559L3.25455 15.4405C2.88326 15.8144 2.39498 16 1.9067 16Z" fill="#fff"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0945 16c-.488 0-.9759-.1855-1.347-.559L.5585 3.25184c-.74467-.74451-.74467-1.94895 0-2.69346.74719-.7445 1.95186-.7445 2.69398 0L15.4415 12.7475c.7447.7445.7447 1.949 0 2.6935-.3711.3735-.8616.559-1.347.559Z" fill="#fff"/></svg>`;
    }

}