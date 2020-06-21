import ASchema from "../../Core/ASchema";
import * as mongoose from "mongoose";
import {SingletonObject} from "../../Core/Decorators/SingletonObject";

@SingletonObject
export default class Answer extends ASchema {
    protected _name: string = 'Survey';

    public getSchema(): mongoose.Schema {
        const schemaObject = new mongoose.Schema({
            title: String
        });

        return schemaObject;
    }
}