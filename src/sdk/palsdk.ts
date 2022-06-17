import { PalVideoExpanded } from "./components/expanded/video_expanded";
import { PalVideoMiniature } from "./components/miniature/video_miniature";

export interface ShowVideoOnlyParams {
    videoUrl: string;
    minVideoUrl: string;
    userName: string;
    companyTitle: string;
    // avatarUrl?: string;
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
        // const avatarUrl = params.avatarUrl;
        const onExpand = params.onExpand;
        const onVideoEnd = params.onVideoEnd;
        const onSkip = params.onSkip;
        const onVideoEndAction = (() => {
            if (onVideoEnd) {
                onVideoEnd();
            }
        });
        const onSkipAction = (() => {
            if (onSkip) {
                onSkip();
            }
        });
        const onVideoExpandedAction = (() => {
            if (onExpand) {
                onExpand();
            }
            const videoExpanded = new PalVideoExpanded(
                userName,
                companyTitle,
                videoUrl,
                onSkipAction,
                onVideoEndAction,
                true
            );
            videoExpanded.appendToDom();

        });

        const videoMiniature = new PalVideoMiniature(
            minVideoUrl,
            150,
            onVideoExpandedAction
        );
        videoMiniature.appendToDom();
    }


}