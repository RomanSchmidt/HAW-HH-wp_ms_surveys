import AObject from "./AObject";
import * as mongoose from "mongoose";
import ASchema from "./ASchema";
import InternalServerError from "./Error/InternalServerError";
import {SingletonObject} from "./Decorator/SingletonObject";
import {ErrorType} from "./Error/ErrorType";
import Arguments from "./Helper/Arguments";
import {Environment} from "./Declorator/Environment";
import App from "./App";

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

    public registerSchema(schemaTemplate: ASchema): mongoose.Model<mongoose.Document> {
        const schema = new mongoose.Schema(schemaTemplate.getSchema());
        if (!this._db) {
            throw new InternalServerError({field: 'db', type: ErrorType.invalid});
        }
        return this._db.model(schemaTemplate.getName(), schema);
    }

    private async _connect(): Promise<void> {
        let uri = Arguments.get('MONGO_URI').MONGO_URI || 'mongodb://localhost:27017/rn_surveys';
        if (App.ENVIRONMENT === Environment.Test) {
            uri += '_test';
        }
        this.log('db connecting to:', uri);
        this._db = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
    }
}