import { ChoiceItem } from "../api/models/survey.model";
import { AuthorCard } from "./components/expanded/author_card";
import { SingleChoiceSurveyForm } from "./components/expanded/survey";
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

export interface ShowSurveyParams {
    videoUrl: string;
    minVideoUrl: string;
    userName: string;
    companyTitle: string;
    // avatarUrl?: string;
    // survey
    question: string;
    choices: ChoiceItem[];
    onTapChoice: OnTapChoice;
    onExpand?: Function;
    onVideoEnd?: Function;
    onSkip?: Function;
}

export type OnTapChoice = (choice: ChoiceItem) => void;


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
        const onVideoEndAction = ((videoExpanded: PalVideoExpanded) => {
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
                videoUrl,
                onSkipAction,
                onVideoEndAction,
                true,
                new AuthorCard(userName, companyTitle),
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

    /**
     * Shows an embedded video then a survey 
     * - user can only choose one choice
     * 
     * @param params @see ShowSurveyParams
     */
    public async showSingleChoiceSurvey(params: ShowSurveyParams) {
        const videoUrl = params.videoUrl;
        const minVideoUrl = params.minVideoUrl;
        const userName = params.userName;
        const companyTitle = params.companyTitle;
        // const avatarUrl = params.avatarUrl;
        const onExpand = params.onExpand;
        const onVideoEnd = params.onVideoEnd;
        const onSkip = params.onSkip;


        const onSkipAction = (() => {
            if (onSkip) {
                onSkip();
            }
        });

        const onVideoEndAction = ((videoExpanded: PalVideoExpanded) => {
            if (onVideoEnd) {
                onVideoEnd();
            }
            const survey = new SingleChoiceSurveyForm(
                params.question,
                params.choices,
            );
            videoExpanded.replaceContent(survey);
            survey.setOnTapChoice((choice) => {
                params.onTapChoice(choice);
                videoExpanded.removeFromDom();
            });
        });

        const onVideoExpandedAction = (() => {
            if (onExpand) {
                onExpand();
            }
            const videoExpanded = new PalVideoExpanded(
                videoUrl,
                onSkipAction,
                onVideoEndAction,
                false,
                new AuthorCard(userName, companyTitle),
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

    /**
     * If any video are found on the current page we delete it
     * 
     */
    public clear() {
        PalVideoMiniature.removeAny();
        PalVideoExpanded.removeAny();
    }


}