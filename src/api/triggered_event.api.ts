import { HttpClient } from "./httpclient";
import { PalSession } from "./models/session.model";
import { ChoiceItem } from "./models/survey.model";
import { VideoTriggerEvent, VideoTriggerEvents } from "./models/triggered_event.model";
import { PalVideoTrigger } from "./models/video_trigger.model";

export class PalTriggeredEventApi {
    constructor(
        private httpClient: HttpClient
    ) { }

    async save(
        triggeredVideoEvent: VideoTriggerEvent,
        eventlogId?: string | null,
    ): Promise<void> {
        if (!eventlogId) {
            return;
        }
        await this.httpClient.post(`/eventlogs/${eventlogId}`, triggeredVideoEvent);
    }

    async saveSurveyAnswer(
        session: PalSession,
        triggeredVideo: PalVideoTrigger,
        choice: ChoiceItem
    ): Promise<void> {
        const event = <VideoTriggerEvent>{
            type: VideoTriggerEvents.answer,
            time: new Date(), //FIXME use dayJS
            sessionId: session.uid,
            args: {
                "answer": choice.code
            }
        };
        await this.save(event, triggeredVideo.eventLogId);
    }

}