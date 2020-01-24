export class ServerError extends Error {

    public code: number;

    constructor(message: string) {

        super();

        Object.setPrototypeOf(this, ServerError.prototype);

        this.message = message;
        this.code = 500;
        this.name = 'server_error';
    }
}
