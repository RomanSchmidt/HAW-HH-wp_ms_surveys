import AObject from "./AObject";
import * as mongoose from "mongoose";
import validator from "validator";
import {CollectionObject} from "./Declorator/CollectionObject";
import {ErrorType} from "./Error/ErrorType";
import {ErrorContainer} from "./Declorator/ErrorContainer";
import BadRequest from "./Error/BadRequest";
import AError from "./Error/AError";
import InternalServerError from "./Error/InternalServerError";

export default abstract class AValidator extends AObject {

    public abstract verifyUpdate<T extends CollectionObject>(payload: T): typeof payload;

    public abstract verifyUpdateExternal<T extends CollectionObject>(payload: T): typeof payload;

    public abstract verifyInsert<T extends CollectionObject>(payload: T): typeof payload;

    public abstract verifyInsertExternal<T extends CollectionObject>(payload: T): typeof payload;

    public convertMongoIdString(id: string): mongoose.Types.ObjectId | undefined {
        if (this.isString(id) && validator.isHexadecimal(id) && id.length === 24) {
            return mongoose.Types.ObjectId(id);
        }
        return undefined;
    }

    public isString(value: any): boolean {
        return value && typeof value === 'string';
    }

    public isEmpty(value: any): boolean {
        const isEmptyObject = (value: any): boolean => {
            if (typeof value.length === 'undefined') {
                const hasNonempty = Object.keys(value).some(element => {
                    return !this.isEmpty(value[element]);
                });
                return hasNonempty ? false : isEmptyObject(Object.keys(value));
            }
            return !value.some((element: any) => {
                return !this.isEmpty(element);
            });
        };

        return (
            value === false
            || typeof value === 'undefined'
            || value === null
            || (typeof value === 'object' && isEmptyObject(value))
        );
    }

    public isMongoId(id: any): boolean {
        return (
            id instanceof mongoose.Types.ObjectId ||
            typeof id == 'string' && validator.isHexadecimal(id) && id.length === 24
        );
    }

    public isArray(value: any): boolean {
        return Array.isArray(value);
    }

    protected _validateArray(payload: CollectionObject, key: string, check: (value: any) => boolean, mandantory: boolean, cleanedPayload: CollectionObject, errors: ErrorContainer): void {
        if (!payload) {
            mandantory && errors.push({field: key, type: ErrorType.empty});
            return;
        }
        if (undefined == payload[key]) {
            mandantory && errors.push({field: key, type: ErrorType.empty});
            return;
        }
        if (!Array.isArray(payload[key])) {
            mandantory && errors.push({field: key, type: ErrorType.invalid});
            return;
        }
        if (!(<[]>payload[key]).length) {
            mandantory && errors.push({field: key, type: ErrorType.empty});
            return;
        }
        const subErrors: ErrorContainer = [];
        const subCleanedPayload: CollectionObject[] = [];
        for (const index in <CollectionObject[]>payload[key]) {
            subCleanedPayload[parseInt(index)] = {};
            this._validate(<CollectionObject>payload[key], parseInt(index), (value: CollectionObject) => {
                try {
                    return check(value);
                } catch (e) {
                    if (e instanceof AError) {
                        e.getMessageObject().forEach(error => {
                            errors.push({field: key + '.' + index + '.' + error.field, type: error.type});
                        });
                    }
                    return false;
                }
            }, mandantory, <any>subCleanedPayload, subErrors);
        }
        if (Object.keys(subErrors).length) {
            for (const subKey in subErrors) {
                const subError = subErrors[subKey];
                errors.push({field: key + '.' + subError.field, type: subError.type});
            }
            return;
        }
        cleanedPayload[key] = subCleanedPayload;
    }

    protected _validate(payload: CollectionObject, key: string | number, check: (value: any) => boolean, mandantory: boolean, cleanedPayload: CollectionObject, errors: ErrorContainer): void {
        if (!payload) {
            mandantory && errors.push({field: 'payload', type: ErrorType.empty});
            return;
        }
        if (undefined == payload[key]) {
            mandantory && errors.push({field: key.toString(), type: ErrorType.empty});
            return;
        }
        if (!check(payload[key])) {
            errors.push({field: key.toString(), type: ErrorType.invalid});
        }
        if (!Object.keys(errors).length) {
            cleanedPayload[key] = <any>payload[key];
        }
    }

    protected _verifyExternal<T extends CollectionObject>(errors: ErrorContainer, cleanedPayload: T): T {
        if (Object.keys(errors).length) {
            throw new BadRequest(errors);
        }
        return cleanedPayload;
    }

    protected _verify<T extends CollectionObject>(errors: ErrorContainer, cleanedPayload: T): T {
        if (Object.keys(errors).length) {
            throw new InternalServerError(errors);
        }
        return cleanedPayload;
    }
}