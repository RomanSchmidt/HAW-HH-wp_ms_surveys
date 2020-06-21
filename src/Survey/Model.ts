import AModel from "../Core/AModel";
import Validator from "./Validator";
import Survey from "./Schema/Survey";
import {SingletonObject} from "../Core/Decorators/SingletonObject";

@SingletonObject
export default class Model extends AModel<Validator, Survey> {
    constructor() {
        super(new Validator(), new Survey);
    }
}