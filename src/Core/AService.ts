import AObject from "./AObject";
import AModel from "./AModel";
import * as mongoose from "mongoose";
import AValidator from "./AValidator";
import ASchema from "./ASchema";

export default abstract class AService<T extends AModel<AValidator, ASchema>> extends AObject {
    private _model: T;

    protected constructor(model: T) {
        super();
        this._model = model;
    }

    async init(): Promise<void> {
        await super.init();
        await this._model.init();
    }

    public async getById<Result = {}>(
        id: mongoose.Types.ObjectId,
        projection: { [key: string]: boolean }
    ): Promise<Result> {
        return this._model.getById(id, projection);
    }

    public async getAll<Result = {}>(
        filter: { [key: string]: typeof mongoose.Types },
        projection: { [key: string]: boolean }
    ): Promise<Result[]> {
        return this._model.getAll(filter, projection);
    }
}