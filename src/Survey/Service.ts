import {SingletonObject} from "../Core/Decorator/SingletonObject";
import AService from "../Core/AService";
import Model from "./Model";
import {CollectionObject} from "../Core/Declarator/CollectionObject";
import {ObjectId} from "mongodb";
import {ErrorType} from "../Core/Declarator/ErrorType";
import Opinion from "./Foreign/Opinion";
import * as mongoose from "mongoose";
import UnknownResource from "../Core/Error/UnknownResource";

@SingletonObject
export default class Service extends AService<Model> {
    constructor() {
        super(new Model());
    }

    public async getById<Result = {}>(id: mongoose.Types.ObjectId, projection: { [p: string]: boolean }): Promise<Result> {
        const result = await super.getById<Result & { opinions?: CollectionObject[] }>(id, projection);
        if (!result) {
            throw new UnknownResource({field: 'survey', type: ErrorType.unknown});
        }
        const opinions = await new Opinion();
        result['opinions'] = await opinions.get.forSurvey(id);
        return result;
    }

    public async create<T extends CollectionObject>(body: T): Promise<T> {
        return await this._model.insert(body);
    }

    public async update<T extends CollectionObject>(id: ObjectId, body: T): Promise<T> {
        const res = await this._model.updateById(id, body);
        if (undefined == res) {
            throw new UnknownResource({field: 'surveyId', type: ErrorType.unknown});
        }
        return res;
    }

    public async remove(id: ObjectId): Promise<boolean> {
        const returnValue = await this._model.dropById(id);
        await new Opinion().delete.bySurveyId(id);
        return returnValue;
    }
}