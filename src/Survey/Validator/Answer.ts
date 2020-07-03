import AValidator from "../../Core/AValidator";
import {SingletonObject} from "../../Core/Decorator/SingletonObject";
import {CollectionObject} from "../../Core/Declorator/CollectionObject";
import {ErrorContainer} from "../../Core/Declorator/ErrorContainer";

@SingletonObject
export default class Answer extends AValidator {
    constructor() {
        super();
    }

    public verifyIncreaseExternal<T extends { [key: string]: number; }>(_payload: T): T {
        throw new Error("Method not implemented.");
    }

    public verifyIncrease<T extends { [key: string]: number; }>(_payload: T): T {
        throw new Error("Method not implemented.");
    }

    public verifyInsert<T extends CollectionObject>(payload: T): T {
        const errors: ErrorContainer = [];
        const cleanedPayload = <T>{};

        this._validate(payload, 'title', this.isString, true, cleanedPayload, errors);

        return this._verify(errors, cleanedPayload);
    }

    public verifyInsertExternal<T extends CollectionObject>(payload: T): T {
        const errors: ErrorContainer = [];
        const cleanedPayload = <T>{};

        this._validate(payload, 'title', this.isString, true, cleanedPayload, errors);

        return this._verifyExternal(errors, cleanedPayload);
    }

    public verifyUpdate<T extends CollectionObject>(payload: T): T {
        const errors: ErrorContainer = [];
        const cleanedPayload = <T>{};

        this._validate(payload, 'title', this.isString, false, cleanedPayload, errors);

        return this._verify(errors, cleanedPayload);
    }

    public verifyUpdateExternal<T extends CollectionObject>(payload: T): T {
        const errors: ErrorContainer = [];
        const cleanedPayload = <T>{};

        this._validate(payload, 'title', this.isString, false, cleanedPayload, errors);

        return this._verifyExternal(errors, cleanedPayload);
    }
}