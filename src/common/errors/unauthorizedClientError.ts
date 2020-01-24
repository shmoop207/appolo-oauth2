export class UnauthorizedClientError extends Error {

    public code: number;

    constructor(message: string) {

        super();

        Object.setPrototypeOf(this, UnauthorizedClientError.prototype);

        this.message = message;
        this.code = 400;
        this.name = 'unauthorized_client';
    }
}
