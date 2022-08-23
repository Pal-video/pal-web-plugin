export enum VideoTriggerEvents {
    videoSkip = 'videoSkip',
    minVideoOpen = 'minVideoOpen',
    videoViewed = 'videoViewed',
    answer = 'answer',
}

export interface VideoTriggerEvent {
    type: VideoTriggerEvents;
    time: Date;
    sessionId: string;
    args?: any;
    // args?: { [code: string]: string };
}