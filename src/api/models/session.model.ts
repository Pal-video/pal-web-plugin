type JsFrameworkType = 'JAVASCRIPT';

export enum PlatformTypes {
  Android = 'android',
  iOS = 'ios',
  web = 'web',
}

export type Platforms = [
  PlatformTypes.Android,
  PlatformTypes.iOS,
  PlatformTypes.web
];

export interface PalSession {
  uid: string;
}

export interface PalSessionRequest {
  frameworkType: JsFrameworkType;
  platform: PlatformTypes;
}
