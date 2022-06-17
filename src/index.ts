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
        this._instance = new Pal(sessionsApi, options, new PalSdk());
        return this._instance;
    }

    constructor(
        private sessionsApi: SessionsApi,
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
        this.palSdk.showVideoOnly(
            <ShowVideoOnlyParams>{
                videoUrl: 'https://res.cloudinary.com/apparence/video/upload/v1654593742/Pal/dev/projects/0fe00730-79db-44d5-863d-9139974abaf6/videos/e712616e-292c-45a3-b80e-e8c92ee55c7c.mp4',
                minVideoUrl: 'https://res.cloudinary.com/apparence/video/upload/v1654593742/Pal/dev/projects/0fe00730-79db-44d5-863d-9139974abaf6/videos/e712616e-292c-45a3-b80e-e8c92ee55c7c.mp4',
                userName: '',
                companyTitle: '',
                avatarUrl: '',
                onExpand: () => { console.log("onExpand called"); },
                onClose: () => { console.log("onClose called"); },
                onVideoEnd: () => { console.log("onVideoEnd called"); },
            }
        );
    }
}
