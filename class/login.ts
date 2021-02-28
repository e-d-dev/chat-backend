export class Login {

    static lastId = 0;

    id: number;
    username: string;
    password: string;
    eMail: string;
    lastLogin: Date | undefined;
    lastIp: string | undefined;

    constructor(
        username: string,
        password: string,
        eMail: string,
        lastLogin: Date | undefined,
        lastIp: string | undefined
    ) {
        Login.lastId++;
        this.id = Login.lastId;
        this.username = username;
        this.password = password;
        this.eMail = eMail;
        this.lastIp = lastIp;
        this.lastLogin = lastLogin;
    }
}