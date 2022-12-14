import { Survey } from "./survey.model";

export interface PalVideoTrigger {
    eventLogId?: string;
    videoId: string;
    creationDate: Date;

    videoUrl: string;
    videoThumbUrl: string;
    imgThumbUrl: string;

    // PalVideos type;
    videoSpeakerName: string;
    videoSpeakerRole: string;
    survey?: Survey;
}