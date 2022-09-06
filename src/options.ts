import { PlatformTypes } from './api/models/session.model';

export interface PalOptions {
    apiKey: string;
    serverUrl?: string;
    platform?: PlatformTypes;
}

export const PRODUCTION_SERVER_URL = "https://back.pal.video";