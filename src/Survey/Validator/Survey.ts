import AValidator from "../../Core/AValidator";
import {CollectionObject} from "../../Core/Declorator/CollectionObject";
import {ErrorContainer} from "../../Core/Declorator/ErrorContainer";
import {SingletonObject} from "../../Core/Decorator/SingletonObject";
import Question from "./Question";

@SingletonObject
export default class Survey extends AValidator {
    constructor() {
        super();
    }

    public verifyInsert<T extends CollectionObject>(payload: T = <T>{}): typeof payload {
        const errors: ErrorContainer = [];
        const cleanedPayload = <T>{};

        this._validate(payload, 'title', this.isString, true, cleanedPayload, errors);

        this._validateArray(payload, 'questions', (question) => {
            return new Question().verifyInsert(question);
        }, true, cleanedPayload, errors);

        return this._verify(errors, cleanedPayload);
    }

    public verifyInsertExternal<T extends CollectionObject>(payload: T = <T>{}): typeof payload {
        const errors: ErrorContainer = [];
        const cleanedPayload = <T>{};

        this._validate(payload, 'title', this.isString, true, cleanedPayload, errors);
        this._validateArray(payload, 'questions', (question): boolean => {
            return new Question().verifyInsertExternal(question);
        }, true, cleanedPayload, errors);

        return this._verifyExternal(errors, cleanedPayload);
    }

    public verifyUpdate<T extends CollectionObject>(payload: T = <T>{}): typeof payload {
        const errors: ErrorContainer = [];
        const cleanedPayload = <T>{};

        this._validate(payload, 'title', this.isString, false, cleanedPayload, errors);
        this._validateArray(payload, 'questions', (question: CollectionObject) => {
            new Question().verifyInsert(question);
            return true;
        }, false, cleanedPayload, errors);

        return this._verify(errors, cleanedPayload);
    }

    public verifyUpdateExternal<T extends CollectionObject>(payload: T = <T>{}): typeof payload {
        const errors: ErrorContainer = [];
        const cleanedPayload = <T>{};

        this._validate(payload, 'title', this.isString, false, cleanedPayload, errors);
        this._validateArray(payload, 'questions', (question: CollectionObject) => {
            new Question().verifyInsertExternal(question);
            return true;
        }, false, cleanedPayload, errors);

        return this._verifyExternal(errors, cleanedPayload);
    }
}