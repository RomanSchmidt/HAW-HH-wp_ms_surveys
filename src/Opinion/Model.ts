import AModel from "../Core/AModel";
import Validator from "./Validator";
import Schema from "./Schema";
import {SingletonObject} from "../Core/Decorators/SingletonObject";

@SingletonObject
export default class Model extends AModel<Validator, Schema>{
    constructor() {
        super(new Validator(), new Schema());
    }
}