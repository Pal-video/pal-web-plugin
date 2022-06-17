import { PalVideoExpanded } from "./components/expanded/video_expanded";
import { PalVideoMiniature } from "./components/miniature/video_miniature";

export interface ShowVideoOnlyParams {
    videoUrl: string;
    minVideoUrl: string;
    userName: string;
    companyTitle: string;
    avatarUrl?: string;
    onExpand?: Function;
    onVideoEnd?: Function;
    onSkip?: Function;
}


export class PalSdk {

    constructor() { }

    /**
     * Shows a simple video without any survey
     * 
     * @param params @see ShowVideoOnlyParams
     */
    public async showVideoOnly(params: ShowVideoOnlyParams) {
        const videoUrl = params.videoUrl;
        const minVideoUrl = params.minVideoUrl;
        const userName = params.userName;
        const companyTitle = params.companyTitle;
        const avatarUrl = params.avatarUrl;
        const onExpand = params.onExpand;
        const onVideoEnd = params.onVideoEnd;
        const onSkip = params.onSkip;
        this.showVideoMiniature({
            minVideoUrl,
            videoUrl,
            userName,
            companyTitle,
            onExpand: onExpand ?? (() => { }),
        });
    }

    /// PRIVATES

    private async showVideoMiniature(
        { minVideoUrl, videoUrl, userName, companyTitle, onExpand }: {
            minVideoUrl: string,
            videoUrl: string,
            userName: string,
            companyTitle: string,
            onExpand: Function,
        }
    ) {
        const videoMiniature = new PalVideoMiniature(
            minVideoUrl,
            150,
            () => {
                if (onExpand) {
                    onExpand();
                }
                this.showVideoExpanded({
                    videoUrl,
                    userName,
                    companyTitle,
                    closeAfterVideoEnd: true,
                    onVideoEndAction: () => { },
                    onClose: () => { }
                });
            },
        );
        videoMiniature.appendToDom();

    }

    private async showVideoExpanded(
        { videoUrl, userName, companyTitle, closeAfterVideoEnd, onVideoEndAction, onClose }: {
            videoUrl: string,
            userName: string,
            companyTitle: string,
            closeAfterVideoEnd: boolean,
            onVideoEndAction: Function,
            onClose: Function,
        }
    ) {
        const videoExpanded = new PalVideoExpanded(
            userName,
            companyTitle,
            videoUrl,
            onClose,
            onVideoEndAction,
            closeAfterVideoEnd
        );
        videoExpanded.appendToDom();
    }


}