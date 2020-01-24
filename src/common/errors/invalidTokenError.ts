
export class InvalidTokenError extends Error {

    public code: number;

    constructor(message: string) {

        super();

        Object.setPrototypeOf(this, InvalidTokenError.prototype);

        this.message = message;
        this.code = 401;
        this.name = 'invalid_token';
    }
}
