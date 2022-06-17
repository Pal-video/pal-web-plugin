import { HttpClient } from "./httpclient";
import { PalEvent, PalEventContext, PalEventType } from "./models/event.model";
import { PalSession } from "./models/session.model";
import { PalVideoTrigger } from "./models/video_trigger.model";

export class PalEventApi {

    constructor(
        private httpClient: HttpClient
    ) { }

    async logCurrentScreen(session: PalSession, name: string): Promise<PalVideoTrigger | null> {
        return this._logEvent(session, <PalEvent>{
            name: name,
            type: PalEventType.setScreen,
        });
    }

    private async _logEvent(session: PalSession, event: PalEvent): Promise<PalVideoTrigger | null> {
        const eventContext = <PalEventContext>{
            sessionUId: session.uid,
            ...event
        };
        const response = await this.httpClient.post<PalVideoTrigger>('/eventlogs', eventContext);
        if (response && response.videoId) {
            return response;
        }
        return null;
    }

}