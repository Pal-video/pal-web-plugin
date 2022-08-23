export interface Survey {
    question: string;
    options: { [key: string]: string };
}

export interface ChoiceItem {
    code: string;
    text: string;
}