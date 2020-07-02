import AValidator from "../Core/AValidator";
import NotImplemented from "../Core/Error/NotImplemented";
import {CollectionObject} from "../Core/Declorator/CollectionObject";
import {SingletonObject} from "../Core/Decorator/SingletonObject";
import {ErrorType} from "../Core/Error/ErrorType";
import {ErrorContainer} from "../Core/Declorator/ErrorContainer";
import {Schema} from "mongoose";

@SingletonObject
export default class Validator extends AValidator {
    constructor() {
        super();
    }

    public verifyInsert<T extends CollectionObject>(payload: T = <T>{}): typeof payload {
        const errors: ErrorContainer = [];
        const cleanedPayload = <T>{};

        this._validate(payload, 'surveyId', this.isMongoId, true, cleanedPayload, errors);
        this._validate(payload, 'response', this.isArray, true, cleanedPayload, errors);

        this._verifyResponses(payload, cleanedPayload, errors);

        return this._verifyExternal(errors, cleanedPayload);
    }

    public verifyInsertExternal<T extends CollectionObject>(payload: T = <T>{}): typeof payload {
        const errors: ErrorContainer = [];
        const cleanedPayload = <T>{};

        this._validate(payload, 'surveyId', this.isMongoId, true, cleanedPayload, errors);
        this._validate(payload, 'response', this.isArray, true, cleanedPayload, errors);

        this._verifyResponses(payload, cleanedPayload, errors);

        return this._verifyExternal(errors, cleanedPayload);
    }


    public verifyUpdateExternal<T extends CollectionObject>(payload: T = <T>{}): typeof payload {
        throw new NotImplemented({field: 'updateExternalOpinion', type: ErrorType.empty});
        return <T>{};
    }

    public verifyUpdate<T extends CollectionObject>(payload: T = <T>{}): typeof payload {
        throw new NotImplemented({field: 'updateOpinion', type: ErrorType.empty});
        return <T>{};
    }

    private _verifyResponses<T extends CollectionObject>(payload: T, cleanedPayload: T, errors: ErrorContainer): void {
        const responses: { questionId: Schema.Types.ObjectId, answerIds: Schema.Types.ObjectId | string[] }[] = <any>cleanedPayload.response;
        if (!responses?.length) {
            errors.push({field: 'response', type: ErrorType.empty});
        } else {
            const cleanedResponses: typeof responses = [];
            responses.forEach(response => {
                const cleanedResponse: typeof response = <any>{};
                this._validate(response, 'questionId', this.isMongoId, true, cleanedResponse, errors);
                this._validateArray(response, 'answerIds', this.isMongoId, true, cleanedResponse, errors);

                if ('answerIds' in cleanedResponse) {
                    (<string[]>cleanedResponse.answerIds).map(value => this.convertMongoIdString(value));
                }
                cleanedResponses.push(cleanedResponse);
            });
            if (!errors.length) {
                (<any>payload).responses = cleanedResponses;
            }
        }
    }
}