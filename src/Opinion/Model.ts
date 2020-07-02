import AModel from "../Core/AModel";
import Validator from "./Validator";
import Schema from "./Schema";
import {SingletonObject} from "../Core/Decorator/SingletonObject";
import {ObjectId} from "mongodb";
import {CollectionObject} from "../Core/Declorator/CollectionObject";

@SingletonObject
export default class Model extends AModel<Validator, Schema> {
    constructor() {
        super(new Validator(), new Schema());
    }

    public async getBySurveyId(surveyId: ObjectId, projection: {}): Promise<CollectionObject[]> {
        return await this._db.find({surveyId}, projection).lean().exec();
    }
}