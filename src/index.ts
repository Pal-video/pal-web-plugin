import { PalEventApi } from './api/event.api';
import { HttpClient } from './api/httpclient';
import { LocalstorageService } from './api/localstorage';
import {
    PalSession,
    PalSessionRequest,
    PlatformTypes,
} from './api/models/session.model';
import { VideoTriggerEvent, VideoTriggerEvents } from './api/models/triggered_event.model';
import { PalVideoTrigger } from './api/models/video_trigger.model';
import { SessionsApi } from './api/sessions.api';
import { PalTriggeredEventApi } from './api/triggered_event.api';
import { PalOptions } from './options';
import { PalSdk, ShowVideoOnlyParams } from './sdk/palsdk';

export class Pal {

    private palSdk: PalSdk;

    private options!: PalOptions;

    private hasInitialized = false;

    private static _instance: Pal | null;

    static getInstance(): Pal {
        if (!this._instance) {
            throw new Error(
                'Pal has not been initialized, please call createInstance'
            );
        }
        return this._instance;
    }

    static createInstance(options: PalOptions): Pal {
        const httpClient = new HttpClient({
            baseUrl: options.serverUrl,
            apiKey: options.apiKey,
        });
        const sessionsApi = new SessionsApi(new LocalstorageService(), httpClient);
        const eventsApi = new PalEventApi(httpClient);
        const triggeredEventApi = new PalTriggeredEventApi(httpClient);
        this._instance = new Pal(
            sessionsApi,
            eventsApi,
            options,
            new PalSdk(),
            triggeredEventApi
        );
        return this._instance;
    }

    constructor(
        private sessionsApi: SessionsApi,
        private eventsApi: PalEventApi,
        options: PalOptions,
        palSdk: PalSdk,
        private triggeredEventApi?: PalTriggeredEventApi,
    ) {
        this.options = options;
        this.palSdk = palSdk;
    }

    async initialize(): Promise<void> {
        await this.sessionsApi.createSession(<PalSessionRequest>{
            frameworkType: 'JAVASCRIPT',
            platform: this.options.platform ?? PlatformTypes.web,
        });
        this.hasInitialized = true;
    }

    async getSession(): Promise<PalSession | null> {
        if (!this.hasInitialized) {
            throw new Error('Pal has not been initialized');
        }
        return this.sessionsApi.getSession();
    }

    async clearSession(): Promise<void> {
        if (!this.hasInitialized) {
            throw new Error('Pal has not been initialized');
        }
        await this.sessionsApi.clearSession();
    }

    /**
     * send the screen view event to the server
     * if a video is triggered, it will be returned
     * depending on configuration
     * - user will see video on first time this screen as been seen
     * Or each time this screen is visited
     */
    async logCurrentScreen(name: string) {
        const session = await this.getSession();
        if (!session) {
            throw new Error('Pal has not been initialized');
        }
        const triggeredVideo = await this.eventsApi.logCurrentScreen(session, name);
        if (triggeredVideo) {
            // console.log('triggeredVideo', triggeredVideo.videoUrl);
            this.palSdk.showVideoOnly(
                <ShowVideoOnlyParams>{
                    videoUrl: triggeredVideo.videoUrl,
                    minVideoUrl: triggeredVideo.videoThumbUrl,
                    userName: triggeredVideo.videoSpeakerName,
                    companyTitle: triggeredVideo.videoSpeakerRole,
                    avatarUrl: '',
                    onExpand: () => this._sendTriggeredEvent(session, triggeredVideo, VideoTriggerEvents.minVideoOpen),
                    onClose: () => this._sendTriggeredEvent(session, triggeredVideo, VideoTriggerEvents.videoSkip),
                    onVideoEnd: () => this._sendTriggeredEvent(session, triggeredVideo, VideoTriggerEvents.videoViewed),
                }
            );
        }
    }

    private async _sendTriggeredEvent(session: PalSession, triggeredVideo: PalVideoTrigger, eventType: VideoTriggerEvents) {
        this.triggeredEventApi?.save(
            <VideoTriggerEvent>{
                type: eventType,
                time: new Date(), //FIXME use dayJS
                sessionId: session.uid,
            },
            triggeredVideo.eventLogId
        );
    }

}
