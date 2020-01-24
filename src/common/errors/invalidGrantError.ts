export class InvalidGrantError extends Error {

    public code: number;

    constructor(message: string) {

        super();

        Object.setPrototypeOf(this, InvalidGrantError.prototype);

        this.message = message;
        this.code = 400;
        this.name = 'invalid_grant';
    }
}
