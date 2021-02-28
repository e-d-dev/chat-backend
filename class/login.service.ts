import { Login } from './login';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { LoginRequest } from '../interface/login.request';
import { RegisterRequest } from '../interface/register.request';
import { AuthRequest } from '../interface/auth.request';
import { Session } from './session';

export class LoginService {

    loginList: Login[];
    sessions: Session[] = [];

    static instance: LoginService;

    static getInstance(): LoginService {
        if (LoginService.instance === undefined) {
            LoginService.instance = new LoginService()
        }
        return LoginService.instance;
    }

    constructor() {
        this.loginList = [];
        this.initService();
    }

    async initService() {
        this.loginList = await this.readListFromFile();
    }

    isTokenCorrect(requestData: AuthRequest): boolean {
        // lösche alle session, die abgelaufen sind
        // mit filter lösen
        this.sessions = this.sessions.filter((elem) => {
            elem.expDate > Date.now();
        })
        //existiert der Token in der Liste?
        let foundSession = this.sessions.find((elem) => {
            elem.token === requestData.token
        })

        return foundSession ? true : false
    }

    generateToken(): string {

        let secret: number = Math.random() * 10000;
        let isUsed: boolean = true;
        let token: string = '';
        while (isUsed) {
            token = bcrypt.hashSync(secret.toString(), bcrypt.genSaltSync(10));
            let doesTokenExist = this.sessions.find((elem) => {
                return elem.token === token
            })
            // bevor return, prüfe ob der Token schon in benutzung ist. (kann ja zufällig sein)
            // wenn der token OK ist setze "isUsed auf false"
            doesTokenExist ? isUsed = true : isUsed = false;
        }

        if (token === undefined) {
            throw new Error();
        }
        return token;
    }

    isLoginCorrect(requestData: LoginRequest): boolean | undefined {
        if (requestData.login === undefined || requestData.login === '') {
            return false
        } else {
            let temp: Login | undefined = this.loginList.find((elem) => {
                return elem.username === requestData.login && elem.password === requestData.password;
            })

            console.log('temp', temp)
            if (temp !== undefined) {
                let session = new Session(this.generateToken(), Date.now() + (5 * 60 * 1000), temp.id);
                // session.token = this.generateToken();
                // session.expDate = Date.now() + (5 * 60 * 1000)
                // console.log(session);
                this.sessions.push(session);
                console.log('list of sessions', this.sessions)
            }

            return temp ? true : false;
        }
    }

    // isRegistrationValid(requestData: RegisterRequest): boolean {
    //     if (requestData.login === undefined || requestData.login === '' || this.existLoginAndMailAlready(requestData) || !this.isMailAddressFormatValid(requestData)) {
    //         return false;
    //     } else {
    //     }
    //     return true;
    // }

    isLoginFieldEmpty(requestData: RegisterRequest): boolean | undefined {
        if (requestData.login === undefined || requestData.login === '') {
            return true;
        }
    }

    existLoginAndMailAlready(requestData: RegisterRequest): boolean {
        let temp: Login | undefined = this.loginList.find((elem) => {
            return elem.username === requestData.login || elem.eMail === requestData.email
        })
        return temp ? true : false;
    }

    isMailAddressFormatValid(requestData: RegisterRequest): boolean {

        if (requestData.email.includes('@') && requestData.email.split('.').length === 2) {
            let temp = requestData.email.split('@');
            let temp2 = temp[1].split('.')
            let temp3 = []
            temp3.push(temp[0], ...temp2);

            temp3.forEach((part) => {
                if (this.isValidEmailPart(part) === false) {
                    return false;
                }
            })
            return true;
        } else {
            return false;
        }
    }

    isValidEmailPart(part: string): boolean {
        const allowedChars: string[] = [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '_'
        ]

        let currentChar: string;
        let foundMatchingChar: string | undefined;

        for (let i = 0; i < part.length; i++) {
            currentChar = part.charAt(i).toLowerCase();
            foundMatchingChar = allowedChars.find((char) => {
                return currentChar === char
            })

            if (foundMatchingChar === undefined) {
                return false;
            }
        }
        return true;
    }

    createLogin(login: string, password: string, email: string, lastLogin: Login | undefined, lastIp: string | undefined) {
        this.loginList.push(new Login(login, password, email, undefined, undefined));
        console.log(this.loginList);
        this.writeListToFile();
    }

    // nach einlesen der datei in "loginList"
    // suche die höchste id in der Liste
    // setze die "lastId" von der klasse Login auf diese Zahl

    async readListFromFile(): Promise<Login[]> { // was das Promise liefert, ist vom Typ 'Login[]'
        return new Promise((resolve, reject) => {
            if (fs.existsSync('C:\\_dev\\Training\\20210201_eMail-Programm\\backend\\logins.json')) {
                fs.readFile('C:\\_dev\\Training\\20210201_eMail-Programm\\backend\\logins.json', 'utf8', (err, data) => {
                    if (err) {
                        throw err;
                    }
                    let temp: Login[] = JSON.parse(data);
                    let tempIds: number[] = [];

                    temp.forEach((elem: Login) => {
                        tempIds.push(elem.id);
                    });
                    Login.lastId = Math.max(...tempIds);
                    resolve(temp);
                })
            } else {
                resolve([]);
            }
        })
    }

    writeListToFile() {
        console.log(this.loginList)
        const content = JSON.stringify(this.loginList);
        fs.writeFile('C:\\_dev\\Training\\20210201_eMail-Programm\\backend\\logins.json', content, err => {
            if (err) {
                throw err;
            }
        })

    }
}


// schreibe eine klasse die eine "abstrakte" funktion für das speichern/lesen für dateisystem gibt