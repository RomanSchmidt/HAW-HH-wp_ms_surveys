import AObject from "./AObject";
import * as mongoose from "mongoose";
import ASchema from "./ASchema";
import InternalServerError from "./Error/InternalServerError";
import {SingletonObject} from "./Decorator/SingletonObject";
import {ErrorType} from "./Declarator/ErrorType";
import Arguments from "./Helper/Arguments";
import {Environment} from "./Declarator/Environment";
import App from "./App";
import Tools from "./Helper/Tools";

@SingletonObject
export class Db extends AObject {
    private _db: mongoose.Mongoose | undefined;
    private _needInit: boolean = true;

    public constructor() {
        super();
    }

    public async init(): Promise<void> {
        if(!this._needInit) {
            return;
        }
        this._needInit = false;
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
        let uri = Arguments.get('MONGO_URI').MONGO_URI || 'mongodb://localhost:27017/wp-ms-surveys';
        if (App.ENVIRONMENT === Environment.Test) {
            uri += '_test';
        }
        this.log('db connecting to:', uri);
        try {
            this._db = await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            });
            this.log('db connected to:', uri);
        } catch (e) {
            if(App.ENVIRONMENT == Environment.Test) {
                throw e;
            }
            this.logError('can not connect to', uri);
            await Tools.timeout(1000);
            await this._connect();
        }
    }
}