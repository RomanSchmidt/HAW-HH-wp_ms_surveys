import AObject from "./AObject";
import * as mongoose from "mongoose";
import validator from "validator";

export default abstract class AValidator extends AObject {

    public abstract verifyUpdate(payload: { [key: string]: typeof mongoose.Types }): typeof payload;

    public abstract verifyInsert(payload: { [key: string]: typeof mongoose.Types }): typeof payload;

    public convertMongoIdString(id: string): mongoose.Types.ObjectId | undefined {
        if (this.isString(id) && validator.isHexadecimal(id) && id.length === 24) {
            return mongoose.Types.ObjectId(id);
        }
        return undefined;
    }

    public isString(value: any): boolean {
        return value && typeof value === 'string';
    }
}