import { Component } from "../component";

export class AuthorCard extends Component {

    private userName: string;

    private userCompanyTitle: string;

    constructor(
        userName: string,
        userCompanyTitle: string,
    ) {
        super();
        this.userName = userName;
        this.userCompanyTitle = userCompanyTitle;
    }

    get html(): string {
        return `<div class="author">
            <div class="name">${this.userName}</div>
            <div class="role">${this.userCompanyTitle}</div>
        </div>`;
    }

}