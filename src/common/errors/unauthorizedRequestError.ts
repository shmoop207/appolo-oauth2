export class UnauthorizedRequestError extends Error {

    public code: number;

    constructor(message: string) {

        super();

        Object.setPrototypeOf(this, UnauthorizedRequestError.prototype);

        this.message = message;
        this.code = 401;
        this.name = 'unauthorized_request';
    }
}
