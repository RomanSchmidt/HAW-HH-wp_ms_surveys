import AValidator from "../Core/AValidator";
import NotImplemented from "../Core/Error/NotImplemented";
import {CollectionObject} from "../Core/Declorator/CollectionObject";
import {SingletonObject} from "../Core/Decorator/SingletonObject";
import {ErrorType} from "../Core/Error/ErrorType";
import {ErrorContainer} from "../Core/Declorator/ErrorContainer";
import {Types} from "mongoose";

@SingletonObject
export default class Validator extends AValidator {
    constructor() {
        super();
    }

    public verifyIncreaseExternal<T extends { [key: string]: number; }>(_payload: T): T {
        throw new Error("Method not implemented.");
    }

    public verifyIncrease<T extends { [key: string]: number; }>(_payload: T): T {
        throw new Error("Method not implemented.");
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
        const responses: { questionId: Types.ObjectId, answerIds: Types.ObjectId | string[] }[] = <any>cleanedPayload.response;
        if (!responses?.length) {
            errors.push({field: 'response', type: ErrorType.empty});
        } else {
            const cleanedResponses: typeof responses = [];
            let responseNumber = 0;
            responses.forEach(response => {
                const
                    cleanedResponse: typeof response = <any>{},
                    nestedErrors: ErrorContainer = [];
                this._validate(response, 'questionId', this.isMongoId, true, cleanedResponse, nestedErrors);
                this._validateArray(response, 'answerIds', this.isMongoId, true, cleanedResponse, nestedErrors);

                if ('answerIds' in cleanedResponse) {
                    (<string[]>cleanedResponse.answerIds).map(value => this.convertMongoIdString(value));
                }
                cleanedResponses.push(cleanedResponse);
                if (nestedErrors.length) {
                    nestedErrors.forEach((value) => errors.push({
                        field: 'response.' + responseNumber + '.' + value.field,
                        type: value.type
                    }))
                }
                ++responseNumber;
            });
            if (!errors.length) {
                (<any>payload).responses = cleanedResponses;
            }
        }
    }
}