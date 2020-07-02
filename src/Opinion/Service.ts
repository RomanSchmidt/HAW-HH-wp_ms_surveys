import AService from "../Core/AService";
import Model from "./Model";
import {SingletonObject} from "../Core/Decorator/SingletonObject";
import {CollectionObject} from "../Core/Declorator/CollectionObject";
import {ObjectId} from "mongodb";
import BadRequest from "../Core/Error/BadRequest";
import {ErrorType} from "../Core/Error/ErrorType";

@SingletonObject
export default class Service extends AService<Model> {
    constructor() {
        super(new Model());
    }

    public async create(body: CollectionObject): Promise<CollectionObject> {
        return this._model.insert(body);
    }

    public async update(id: ObjectId, projection: CollectionObject): Promise<CollectionObject> {
        const res = await this._model.updateById(id, projection);
        if (undefined == res) {
            throw new BadRequest({field: 'opinionId', type: ErrorType.unknown});
        }
        return res;
    }

    public async getBySurveyId(surveyId: ObjectId, projection: {}): Promise<CollectionObject[]> {
        const res = await this._model.getBySurveyId(surveyId, projection);
        if (undefined == res) {
            throw new BadRequest({field: 'opinionId', type: ErrorType.unknown});
        }
        return res;
    }
}