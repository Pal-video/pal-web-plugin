import { HttpClient } from "./httpclient";
import { VideoTriggerEvent } from "./models/triggered_event.model";

export class PalTriggeredEventApi {
    constructor(
        private httpClient: HttpClient
    ) { }

    save(
        triggeredVideoEvent: VideoTriggerEvent,
        eventlogId?: string | null,
    ): void {
        if (!eventlogId) {
            return;
        }
        this.httpClient.post(`/eventlogs/${eventlogId}`, triggeredVideoEvent);
    }

}