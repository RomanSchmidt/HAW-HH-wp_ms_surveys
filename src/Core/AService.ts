import AObject from "./AObject";
import AModel from "./AModel";
import * as mongoose from "mongoose";
import AValidator from "./AValidator";
import ASchema from "./ASchema";
import {CollectionObject} from "./Declarator/CollectionObject";

export default abstract class AService<T extends AModel<AValidator, ASchema>> extends AObject {
    protected _model: T;

    protected constructor(model: T) {
        super();
        this._model = model;
    }

    public async init(): Promise<void> {
        await super.init();
        await this._model.init();
    }

    public async getById<Result = {}>(
        id: mongoose.Types.ObjectId,
        projection: { [key: string]: boolean }
    ): Promise<Result | undefined> {
        return await this._model.getById(id, projection);
    }

    public async getAll<Result extends CollectionObject>(
        filter: { [key: string]: typeof mongoose.Types },
        projection: { [key: string]: boolean }
    ): Promise<Result[]> {
        return await this._model.getAll(filter, projection);
    }

    public async increase<T extends { [key: string]: number }>(id: mongoose.Types.ObjectId, payload: T): Promise<T> {
        return await this._model.increaseById(id, payload);
    }
}