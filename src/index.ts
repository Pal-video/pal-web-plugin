import { PalEventApi } from './api/event.api';
import { HttpClient } from './api/httpclient';
import { LocalstorageService } from './api/localstorage';
import {
    PalSession,
    PalSessionRequest,
    PlatformTypes,
} from './api/models/session.model';
import { SessionsApi } from './api/sessions.api';
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
        this._instance = new Pal(sessionsApi, eventsApi, options, new PalSdk());
        return this._instance;
    }

    constructor(
        private sessionsApi: SessionsApi,
        private eventsApi: PalEventApi,
        options: PalOptions,
        palSdk: PalSdk,
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
            this.palSdk.showVideoOnly(
                <ShowVideoOnlyParams>{
                    videoUrl: triggeredVideo.videoUrl,
                    minVideoUrl: triggeredVideo.videoThumbUrl,
                    userName: triggeredVideo.videoSpeakerName,
                    companyTitle: triggeredVideo.videoSpeakerRole,
                    avatarUrl: '',
                    onExpand: () => { console.log("onExpand called"); },
                    onClose: () => { console.log("onClose called"); },
                    onVideoEnd: () => { console.log("onVideoEnd called"); },
                }
            );
        }
    }
}
