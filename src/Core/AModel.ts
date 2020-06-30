import AValidator from "./AValidator";
import AObject from "./AObject";
import ASchema from "./ASchema";
import {Db} from "./Db";
import * as mongoose from "mongoose";
import InternalServerError from "./Error/InternalServerError";
import {CollectionObject} from "./Declorator/CollectionObject";
import {ErrorType} from "./Error/ErrorType";
import BadRequest from "./Error/BadRequest";

export default abstract class AModel<T extends AValidator, V extends ASchema> extends AObject {
    private readonly _validator: T;
    private readonly _schema: V;
    private _db: mongoose.Model<mongoose.Document> | undefined;

    protected constructor(validator: T, schema: V) {
        super();
        this._validator = validator;
        this._schema = schema;
    }

    async init(): Promise<void> {
        await super.init();
        const db = new Db();
        await db.init();
        this._db = db.registerSchema(this._schema);
    }

    public async getById<Result = CollectionObject>(
        id: mongoose.Types.ObjectId,
        projection: { [key: string]: boolean }
    ): Promise<Result> {

        const object = <any>await this._db?.findOne({_id: id}, projection).lean().exec();
        return <Result>object;
    }

    public async getAll<Result extends CollectionObject>(
        filter: { [key: string]: typeof mongoose.Types },
        projection: { [key: string]: boolean }
    ): Promise<Result[]> {

        return <Result[]><any>await this._db?.find(filter, projection).lean().exec();
    }

    public async updateById<T extends CollectionObject>(id: mongoose.Types.ObjectId, body: T): Promise<typeof body | undefined> {
        return this.update({_id: id}, body);
    }

    public async update<T extends CollectionObject>(filter: { [key: string]: any }, payload: T): Promise<typeof payload | undefined> {
        if(this._validator.isEmpty(payload)) {
            throw new BadRequest({field:'payload', type:ErrorType.empty});
        }
        const cleanedPayload = this._validator.verifyUpdate(payload);
        const result = await this._db?.findOneAndUpdate(filter, {$set: cleanedPayload}, {
            lean: true,
            new: true,
            select: {},
            upsert: false
        });
        if (!result) {
            return undefined;
        }
        const returnObject: CollectionObject = {};
        for (const i in cleanedPayload) {
            if (i in result) {
                returnObject[i] = (<any>result)[i];
            }
        }
        return <T>returnObject;
    }

    public async insert<T extends CollectionObject>(body: T): Promise<typeof body> {
        const
            cleanedBody = this._validator.verifyInsert(body),
            result = await this._db?.create(cleanedBody, {
                lean: true,
                new: true,
                select: {},
                upsert: false
            });

        if (!result) {
            throw new InternalServerError({field: 'insertResult', type: ErrorType.invalid});
        }
        return <T><any>result;
    }

    public async dropById(id: mongoose.Types.ObjectId): Promise<boolean> {
        const result = await this._db?.deleteOne({_id: id});
        return (result?.deletedCount || 0) > 0;
    }
}