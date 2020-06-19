export default abstract class AError extends Error {
    protected abstract readonly _status: number;
    protected readonly _message: string;

    constructor(message: string) {
        super();
        this._message = message;
    }

    public getStatus(): number {
        return this._status;
    }

    /**
     * @todo get more info to message
     */
    public getMessage() {
        return this._message;
    }
}