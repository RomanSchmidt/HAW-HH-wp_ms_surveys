import {ErrorContainer} from "../Declarator/ErrorContainer";
import {ErrorMessage} from "../Declarator/ErrorMessage";
import {ErrorResult} from "../Declarator/ErrorResult";

export default abstract class AError extends Error {
    protected abstract readonly _status: number;
    protected readonly _message: ErrorContainer;

    constructor(message: ErrorMessage | ErrorContainer) {
        super();
        this._message = Array.isArray(message) ? message : [message];
        this.message = JSON.stringify(this.getMessage());
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