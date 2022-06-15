import {HttpClient} from './api/httpclient';
import {LocalstorageService} from './api/localstorage';
import {
  PalSession,
  PalSessionRequest,
  PlatformTypes,
} from './api/models/session.model';
import {SessionsApi} from './api/sessions.api';

export interface PalOptions {
  apiKey: string;
  serverUrl: string;
  platform?: PlatformTypes;
}

export class Pal {
  private options!: PalOptions;

  private hasInitialized = false;

  private static _instance: Pal | null;

  static getInstance(options?: PalOptions): Pal {
    if (!this._instance) {
      throw new Error(
        'Pal has not been initialized, please call createInstance'
      );
    }
    return this._instance;
  }

  static createInstance(options: PalOptions) {
    const httpClient = new HttpClient({
      baseUrl: options.serverUrl,
      apiKey: options.apiKey,
    });
    const sessionsApi = new SessionsApi(new LocalstorageService(), httpClient);
    this._instance = new Pal(sessionsApi, options);
  }

  constructor(private sessionsApi: SessionsApi, options: PalOptions) {
    this.options = options;
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
    // await this.sessionsApi.clearSession();
    // await this.sessionsApi.createSession();
  }
}
