import {SingletonObject} from "../Core/Decorator/SingletonObject";
import AService from "../Core/AService";
import Model from "./Model";
import {CollectionObject} from "../Core/Declorator/CollectionObject";
import {ObjectId} from "mongodb";
import BadRequest from "../Core/Error/BadRequest";
import {ErrorType} from "../Core/Error/ErrorType";
import Opinion from "./Foreign/Opinion";
import * as mongoose from "mongoose";

@SingletonObject
export default class Service extends AService<Model> {
    constructor() {
        super(new Model());
    }

    async getById<Result = {}>(id: mongoose.Types.ObjectId, projection: { [p: string]: boolean }): Promise<Result> {
        const result = await super.getById<Result & { opinions?: CollectionObject[] }>(id, projection);
        const opinions = await new Opinion();
        result['opinions'] = await opinions.get.forSurvey(id);
        return result;
    }

    public async create<T extends CollectionObject>(body: T): Promise<T> {
        return this._model.insert(body);
    }

    public async update<T extends CollectionObject>(id: ObjectId, body: T): Promise<T> {
        const res = await this._model.updateById(id, body);
        if (undefined == res) {
            throw new BadRequest({field: 'surveyId', type: ErrorType.unknown});
        }
        return res;
    }

    public async remove(id: ObjectId): Promise<boolean> {
        return this._model.dropById(id);
    }
}