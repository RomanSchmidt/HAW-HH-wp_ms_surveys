import AService from "../Core/AService";
import Model from "./Model";
import {SingletonObject} from "../Core/Decorator/SingletonObject";
import {CollectionObject} from "../Core/Declarator/CollectionObject";
import {ObjectId} from "mongodb";
import {ErrorType} from "../Core/Declarator/ErrorType";
import Survey from "./Foreign/Survey";
import * as mongoose from "mongoose";
import {Types} from "mongoose";
import UnknownResource from "../Core/Error/UnknownResource";

@SingletonObject
export default class Service extends AService<Model> {
    constructor() {
        super(new Model());
    }

    public async init(): Promise<void> {
        await new Survey().init();
        await super.init();
    }

    public async create<T extends CollectionObject>(body: T): Promise<T> {
        const newOpinion = await this._model.insert(body);
        await new Survey().patch.incUserCounter(<Types.ObjectId>body.surveyId);
        return newOpinion;
    }

    public async update<T extends CollectionObject>(id: ObjectId, projection: T): Promise<T> {
        const res = await this._model.updateById(id, projection);
        if (undefined == res) {
            throw new UnknownResource({field: 'opinionId', type: ErrorType.unknown});
        }
        return res;
    }

    public async getBySurveyId(surveyId: ObjectId, projection: {}): Promise<CollectionObject[]> {
        const res = await this._model.getBySurveyId(surveyId, projection);
        if (undefined == res) {
            throw new UnknownResource({field: 'opinionId', type: ErrorType.unknown});
        }
        return res;
    }

    public async removeBySurveyId(surveyId: mongoose.Types.ObjectId): Promise<boolean> {
        return await this._model.removeBySurveyId(surveyId);
    }
}