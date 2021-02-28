export class Envelope<t> {

    status: Boolean;

    contentError: string;

    content: t;

}

// new Envelope<User[]>