import AModel from "../Core/AModel";
import Validator from "./Validator/Survey";
import SurveySchema from "./Schema/Survey";
import {SingletonObject} from "../Core/Decorator/SingletonObject";

@SingletonObject
export default class Model extends AModel<Validator, SurveySchema> {
    constructor() {
        super(new Validator(), new SurveySchema());
    }
}