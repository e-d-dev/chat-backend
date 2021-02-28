export class Session {
    token: string;
    expDate: number;
    userId: number;

    constructor(token: string, expDate: number, userId: number) {
        this.token = token;
        this.expDate = expDate;
        this.userId = userId;
    }
}