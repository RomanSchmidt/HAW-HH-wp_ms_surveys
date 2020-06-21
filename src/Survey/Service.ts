import {SingletonObject} from "../Core/Decorators/SingletonObject";
import AService from "../Core/AService";
import Model from "./Model";

@SingletonObject
export default class Service extends AService<Model> {
    constructor() {
        super(new Model());
    }
}