import { PalEventApi } from './api/event.api';
import { HttpClient } from './api/httpclient';
import { LocalstorageService } from './api/localstorage';
import {
    PalSession,
    PalSessionRequest,
    PlatformTypes,
} from './api/models/session.model';
import { ChoiceItem } from './api/models/survey.model';
import { VideoTriggerEvent, VideoTriggerEvents } from './api/models/triggered_event.model';
import { PalVideoTrigger } from './api/models/video_trigger.model';
import { SessionsApi } from './api/sessions.api';
import { PalTriggeredEventApi } from './api/triggered_event.api';
import { PalOptions, PRODUCTION_SERVER_URL } from './options';
import { PalSdk, ShowSurveyParams, ShowVideoOnlyParams } from './sdk/palsdk';

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
            baseUrl: options.serverUrl ?? PRODUCTION_SERVER_URL,
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
        if (this.hasInitialized) {
            return;
        }
        try {
            const hasSessionInStorage = (await this.sessionsApi.getSession()) != null;
            if (hasSessionInStorage) {
                this.hasInitialized = true;
                return;
            }
            await this.sessionsApi.createSession(<PalSessionRequest>{
                frameworkType: 'JAVASCRIPT',
                platform: this.options.platform ?? PlatformTypes.web,
            });
            this.hasInitialized = true;
        } catch (err) {
            console.error("cannot initialize Pal plugin", err);
        }
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
        this.sessionsApi.clearSession();
    }

    /**
     * send the screen view event to the server
     * if a video is triggered, it will be returned
     * depending on configuration
     * - user will see video on first time this screen as been seen
     * Or each time this screen is visited
     * 
     * each time we log a new screen we remove old videos from the page
     */
    async logCurrentScreen(name: string) {
        this.palSdk.clear();

        const session = await this.getSession();
        if (!session) {
            throw new Error('Pal has not been initialized');
        }
        try {
            const triggeredVideo = await this.eventsApi.logCurrentScreen(session, name);
            if (!triggeredVideo) {
                return;
            }
            let isSurveyType = triggeredVideo.survey != null;
            let isTalkType = triggeredVideo.survey == null;
            // console.log('triggeredVideo', triggeredVideo.videoUrl);
            if (isTalkType) {
                this.palSdk.showVideoOnly(
                    <ShowVideoOnlyParams>{
                        videoUrl: triggeredVideo.videoUrl,
                        minVideoUrl: triggeredVideo.videoThumbUrl,
                        userName: triggeredVideo.videoSpeakerName,
                        companyTitle: triggeredVideo.videoSpeakerRole,
                        onExpand: () => this._sendTriggeredEvent(session, triggeredVideo, VideoTriggerEvents.minVideoOpen),
                        onSkip: () => this._sendTriggeredEvent(session, triggeredVideo, VideoTriggerEvents.videoSkip),
                        onVideoEnd: () => this._sendTriggeredEvent(session, triggeredVideo, VideoTriggerEvents.videoViewed),
                    }
                );
            } else if (isSurveyType) {
                const options: ChoiceItem[] = [];
                const keys = Object.keys(triggeredVideo.survey!.options);
                for (let i = 0; i < keys.length; i++) {
                    options.push(<ChoiceItem>{
                        code: keys[i],
                        text: triggeredVideo.survey!.options[keys[i]],
                    });
                }
                this.palSdk.showSingleChoiceSurvey(
                    <ShowSurveyParams>{
                        videoUrl: triggeredVideo.videoUrl,
                        minVideoUrl: triggeredVideo.videoThumbUrl,
                        userName: triggeredVideo.videoSpeakerName,
                        companyTitle: triggeredVideo.videoSpeakerRole,
                        question: triggeredVideo.survey!.question,
                        choices: options,
                        onTapChoice: (choice) => this.triggeredEventApi?.saveSurveyAnswer(session, triggeredVideo, choice),
                        onExpand: () => this._sendTriggeredEvent(session, triggeredVideo, VideoTriggerEvents.minVideoOpen),
                        onSkip: () => this._sendTriggeredEvent(session, triggeredVideo, VideoTriggerEvents.videoSkip),
                        onVideoEnd: () => this._sendTriggeredEvent(session, triggeredVideo, VideoTriggerEvents.videoViewed),
                    }
                );
            }
        } catch (err) {
            console.error("logCurrentScreen");
            console.error(err);
        }
    }

    private async _sendTriggeredEvent(
        session: PalSession,
        triggeredVideo: PalVideoTrigger,
        eventType: VideoTriggerEvents,
    ) {
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
