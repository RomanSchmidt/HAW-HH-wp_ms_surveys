import AService from "../Core/AService";
import Model from "./Model";
import {SingletonObject} from "../Core/Decorators/SingletonObject";

@SingletonObject
export default class Service extends AService<Model>{
    constructor() {
        super(new Model());
    }
}