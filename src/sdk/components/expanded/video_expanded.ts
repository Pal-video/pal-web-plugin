import { BaseComponent } from "../component";

export const VIDEO_EXPANDED_HTML_ID = "PalVideoExpanded";

export const VIDEO_SKIP_BTN_HTML_CLASS = "PalVideoExpandedSkipBtn";

export const VIDEO_ID = "PalVideoPlayer";

export class PalVideoExpanded extends BaseComponent {

    private videoUrl: string;

    private userName: string;

    private userCompanyTitle: string;

    private onSkipTap: Function;

    private onVideoEnd: Function;

    private closeOnEnd: boolean;

    constructor(
        userName: string,
        userCompanyTitle: string,
        videoUrl: string,
        onSkipTap: Function,
        onVideoEnd: Function,
        closeOnEnd: boolean,
    ) {
        super();
        this.userName = userName;
        this.userCompanyTitle = userCompanyTitle;
        this.videoUrl = videoUrl;
        this.onSkipTap = onSkipTap;
        this.onVideoEnd = onVideoEnd;
        this.closeOnEnd = closeOnEnd;
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
            this.onVideoEnd();
            if (this.closeOnEnd) {
                this.removeFromDom();
            }
        };
        video.play();
    }

    get html(): string {
        return `<div 
            class="content" 
            style="">
            <button class="palBtn ${VIDEO_SKIP_BTN_HTML_CLASS}">Skip</button>
            <video 
                id="${VIDEO_ID}"
                src="${this.videoUrl}"
            ></video>
            <div class="author">
                <div class="name">${this.userName}</div>
                <div class="role">${this.userCompanyTitle}</div>
            <div>
        </div>
        `;
    }

}