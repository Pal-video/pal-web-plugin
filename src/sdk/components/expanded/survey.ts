import { ChoiceItem } from "../../../api/models/survey.model";
import { OnTapChoice } from "../../palsdk";
import { Component } from "../component";

export class SingleChoiceSurveyForm extends Component {

    private question: string;

    private choices: ChoiceItem[];

    constructor(
        question: string,
        choices: ChoiceItem[],
    ) {
        super();
        this.question = question;
        this.choices = choices;
    }

    get html(): string {
        return `
            <div class="pal-form-background"></div>
            <div class="pal-form">
                <div class="question">${this.question}</div>
                ${this.choicesHtml}
            </div>
        `
    }

    private get choicesHtml(): string {
        let result = '<div class="choices">';
        for (let i = 0; i < this.choices.length; i++) {
            const choice = this.choices[i];
            result += `<div class="choice">${choice.text}</div>`;
        }
        result += `</div>`;
        return result;
    }

    setOnTapChoice(onTapChoice: OnTapChoice) {
        const options = document
            .getElementById("PalVideoExpanded")!
            .getElementsByClassName("choice");
        for (let i = 0; i < options.length; i++) {
            options[i].addEventListener("click", () => {
                let choice = this.choices[i];
                onTapChoice(choice);
            });
        }
    }


}