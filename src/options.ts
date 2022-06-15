import {PlatformTypes} from './api/models/session.model';

export interface PalOptions {
  apiKey: string;
  serverUrl: string;
  platform?: PlatformTypes;
}
