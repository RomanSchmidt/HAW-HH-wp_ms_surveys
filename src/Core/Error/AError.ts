import {ErrorContainer} from "../Declorator/ErrorContainer";
import {ErrorMessage} from "../Declorator/ErrorMessage";
import {ErrorResult} from "../Declorator/ErrorResult";

export default abstract class AError extends Error {
    protected abstract readonly _status: number;
    protected readonly _message: ErrorContainer;

    constructor(message: ErrorMessage | ErrorContainer) {
        super();
        this._message = Array.isArray(message) ? message : [message];
    }

    public getStatus(): number {
        return this._status;
    }

    public getMessageObject(): ErrorContainer {
        return this._message;
    }

    public getMessage(): ErrorResult {
        const message: ErrorResult = {};
        this._message.forEach(singleMessage => {
            message[singleMessage.field] = singleMessage.type;
        });
        return message;
    }
}