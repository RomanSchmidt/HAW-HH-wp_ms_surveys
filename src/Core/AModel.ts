import AValidator from "./AValidator";
import AObject from "./AObject";
import ASchema from "./ASchema";
import {Db} from "./Db";
import * as mongoose from "mongoose";
import InternalServerError from "./Error/InternalServerError";

type Result = { [key: string]: any };

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

    public async getById<Result = {}>(
        id: mongoose.Types.ObjectId,
        projection: { [key: string]: boolean }
    ): Promise<Result> {

        const object = <any>await this._db?.findOne({_id: id}, projection).lean().exec();
        return <Result>object;
    }

    public async getAll<Result = {}>(
        filter: { [key: string]: typeof mongoose.Types },
        projection: { [key: string]: boolean }
    ): Promise<Result[]> {

        return <Result[]><any>await this._db?.find(filter, projection).lean().exec();
    }

    public async updateById(id: mongoose.Types.ObjectId, body: { [key: string]: typeof mongoose.Types }): Promise<Result> {
        return this.update({_id: id}, body);
    }

    public async update(filter: { [key: string]: any }, body: { [key: string]: typeof mongoose.Types }): Promise<Result> {
        const cleanedBody = this._validator.verifyUpdate(body);
        const result = await this._db?.findOneAndUpdate(filter, {$set: cleanedBody}, {
            lean: true,
            new: true,
            select: {},
            upsert: false
        });
        if (!result) {
            throw new InternalServerError('update error: result empty');
        }
        const returnObject: Result = {};
        for (const i in cleanedBody) {
            if (i in result) {
                returnObject[i] = (<any>result)[i];
            }
        }
        return returnObject;
    }

    public async insert(body: { [key: string]: typeof mongoose.Types }): Promise<Result> {
        const
            cleanedBody = this._validator.verifyInsert(body),
            result = await this._db?.create(cleanedBody, {
                lean: true,
                new: true,
                select: {},
                upsert: false
            });

        if (!result) {
            throw new InternalServerError('insert error: result empty');
        }
        return result.toJSON();
    }
}