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
                this.showVideo({
                    videoUrl,
                    userName,
                    companyTitle,
                    onVideoEndAction: () => { },
                    onClose: () => { }
                });
            },
        );
        videoMiniature.appendToDom();

    }

    private async showVideo(
        { videoUrl, userName, companyTitle, onVideoEndAction, onClose }: {
            videoUrl: string,
            userName: string,
            companyTitle: string,
            onVideoEndAction: Function,
            onClose: Function,
        }
    ) {

    }

    // Future<void> showVideoAsset({
    //     required BuildContext context,
    //     required String videoAsset,
    //     required String userName,
    //     required String companyTitle,
    //     required Function onVideoEndAction,
    //     required bool animateOnVideoEnd,
    //     Function? onClose,
    //     Function? onExpand,
    //     String? avatarUrl,
    //     Widget? child,
    //     Function? onSkip,
    //   }) async {

    // Future<void> showMiniatureVideoAsset({
    //     required BuildContext context,
    //     required String videoAsset,
    //     required String userName,
    //     required String companyTitle,
    //     required Function onVideoEndAction,
    //     required Function close,
    //     required bool animateOnVideoEnd,
    //     Function? onSkip,
    //     String? avatarUrl,
    //     Widget? child,
    //   }) async {

    // Future<void> showExpandedVideoAsset({
    //     required BuildContext context,
    //     required String videoAsset,
    //     required String userName,
    //     required String companyTitle,
    //     required Function onVideoEndAction,
    //     required Function close,
    //     required bool animateOnVideoEnd,
    //     Function? onSkip,
    //     String? avatarUrl,
    //     Widget? child,
    //   }) async {


}