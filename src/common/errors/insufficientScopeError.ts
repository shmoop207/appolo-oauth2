
export class InsufficientScopeError extends Error {

    public code: number;

    constructor(message: string) {

        super();

        Object.setPrototypeOf(this, InsufficientScopeError.prototype);

        this.message = message;
        this.code = 403;
        this.name = 'insufficient_scope';
    }
}
