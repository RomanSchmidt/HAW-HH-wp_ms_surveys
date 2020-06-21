import AObject from "./AObject";
import {SingletonObject} from "./Decorators/SingletonObject";
import * as mongoose from "mongoose";
import ASchema from "./ASchema";
import InternalServerError from "./Error/InternalServerError";

@SingletonObject
export class Db extends AObject {
    private _db: mongoose.Mongoose | undefined;

    public constructor() {
        super();
    }

    public async init(): Promise<void> {
        await super.init();
        await this._connect();
    }

    public registerSchema(schemaTemplate: ASchema): mongoose.Model<mongoose.Document> | undefined {
        const schema = new mongoose.Schema(schemaTemplate.getSchema());
        if (!this._db) {
            throw new InternalServerError('_db is not initialized');
        }
        return this._db.model(schemaTemplate.getName(), schema);
    }

    private async _connect(): Promise<void> {
        this._db = await mongoose.connect('mongodb://localhost/rn_surveys', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
}