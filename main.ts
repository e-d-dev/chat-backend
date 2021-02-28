import Express, { request } from 'express';
import bodyParser from 'body-parser'
import { LoginRequest } from './interface/login.request';
import { RegisterRequest } from './interface/register.request';
import { LoginService } from './class/login.service';
import { AuthRequest } from './interface/auth.request';
import { Envelope } from './class/envelope';
import { ERROR_CODE } from './class/enum/error-code.enum';

let server: Express.Application = Express();

let loginService = LoginService.getInstance();

server.use(bodyParser.json());

loginService.readListFromFile().then((data) => {
    loginService.loginList = data;
    server.listen(8080);
});

server.post('/api/login', (request, response) => {
    console.log(request.body)
    let requestData: LoginRequest = request.body;
    if (loginService.isLoginCorrect(requestData)) {
        response.sendStatus(200)
    } else {
        response.sendStatus(400);
    }
});


server.post('/api/isLoggedIn', (request, response) => {
    console.log(request.body)
    let requestData: AuthRequest = request.body;
    if (loginService.isTokenCorrect(requestData)) {
        response.sendStatus(200)
    } else {
        response.sendStatus(400);
    }
});

server.post('/api/register', (request, response) => {
    console.log(request.body)
    let requestData: RegisterRequest = request.body;
    let envelope: Envelope<any> = new Envelope<any>();


    // if (loginService.isLoginFieldEmpty(requestData)) {
    //     envelope.status = false;
    //     envelope.contentError = new Error(ERROR_CODE.EMPTY_LOGIN);
    // }

    if (loginService.existLoginAndMailAlready(requestData)) {
        envelope.status = false;
        envelope.contentError = ERROR_CODE.USER_OR_EMAIL_EXIST;
    }

    if (!loginService.isMailAddressFormatValid(requestData)) {
        envelope.status = false;
        envelope.contentError = ERROR_CODE.INVALID_EMAIL_FORMAT;
    }

    envelope.content = { requestData }

    if (envelope.status === undefined) {
        loginService.createLogin(requestData.login, requestData.password, requestData.email, undefined, undefined);
    }
    console.log(loginService.loginList)

    response.send(envelope)
});
