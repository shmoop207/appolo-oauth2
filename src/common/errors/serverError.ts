export class ServerError extends Error {

    public code: number;
    public inner: Error;

    constructor(message: string,err?:Error) {

        super();

        Object.setPrototypeOf(this, ServerError.prototype);

        this.message = message;
        this.code = 500;
        this.name = 'server_error';
        this.inner = err;

    }
}
