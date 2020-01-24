export class InvalidRequestError extends Error {

    public code: number;

    constructor(message: string) {

        super();

        Object.setPrototypeOf(this, InvalidRequestError.prototype);

        this.message = message;
        this.code = 400;
        this.name = 'invalid_request';
    }
}
