
export class InvalidScopeError extends Error {

    public code: number;

    constructor(message: string) {

        super();

        Object.setPrototypeOf(this, InvalidScopeError.prototype);

        this.message = message;
        this.code = 400;
        this.name = 'invalid_scope';
    }
}
