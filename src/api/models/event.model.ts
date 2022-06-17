export enum PalEventType {
    login = "login",
    logout = "logout",
    setScreen = "setScreen",
    setButtonClick = "setButtonClick",
}

export interface PalEvent {
    name: string;
    type: PalEventType;
    attrs?: Map<String, unknown>;
}

export interface PalEventContext extends PalEvent {
    sessionUId: string;
}