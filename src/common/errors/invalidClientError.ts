export class InvalidClientError extends Error {

    public code: number;

    constructor(message: string) {

        super();

        Object.setPrototypeOf(this, InvalidClientError.prototype);

        this.message = message;
        this.code = 400;
        this.name = 'invalid_client';
    }
}
