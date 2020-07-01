import AValidator from "../../Core/AValidator";
import {CollectionObject} from "../../Core/Declorator/CollectionObject";
import {SingletonObject} from "../../Core/Decorator/SingletonObject";
import {ErrorContainer} from "../../Core/Declorator/ErrorContainer";
import Answer from "./Answer";

@SingletonObject
export default class Question extends AValidator {

    constructor() {
        super();
    }

    public verifyInsert<T extends CollectionObject>(payload: T): T {
        const errors: ErrorContainer = [];
        const cleanedPayload = <T>{};

        this._validate(payload, 'title', this.isString, true, cleanedPayload, errors);
        this._validateArray(payload, 'answers', (question: CollectionObject) => {
            new Answer().verifyInsert(question);
            return true;
        }, true, cleanedPayload, errors);

        return this._verify(errors, cleanedPayload);
    }

    public verifyInsertExternal<T extends CollectionObject>(payload: T): T {
        const errors: ErrorContainer = [];
        const cleanedPayload = <T>{};

        this._validate(payload, 'title', this.isString, true, cleanedPayload, errors);
        this._validateArray(payload, 'answers', (question: CollectionObject) => {
            new Answer().verifyInsertExternal(question);
            return true;
        }, true, cleanedPayload, errors);

        return this._verifyExternal(errors, cleanedPayload);
    }

    public verifyUpdate<T extends CollectionObject>(payload: T): T {
        const errors: ErrorContainer = [];
        const cleanedPayload = <T>{};

        this._validate(payload, 'title', this.isString, false, cleanedPayload, errors);
        this._validateArray(payload, 'answers', (question: CollectionObject) => {
            new Answer().verifyInsert(question);
            return true;
        }, false, cleanedPayload, errors);

        return this._verify(errors, cleanedPayload);
    }

    public verifyUpdateExternal<T extends CollectionObject>(payload: T): T {
        const errors: ErrorContainer = [];
        const cleanedPayload = <T>{};

        this._validate(payload, 'title', this.isString, false, cleanedPayload, errors);
        this._validateArray(payload, 'answers', (question: CollectionObject) => {
            new Answer().verifyInsertExternal(question);
            return true;
        }, false, cleanedPayload, errors);

        return this._verifyExternal(errors, cleanedPayload);
    }
}