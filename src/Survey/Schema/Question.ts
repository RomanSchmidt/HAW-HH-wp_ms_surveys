import ASchema from "../../Core/ASchema";
import * as mongoose from "mongoose";
import Answer from "./Answer";
import {SingletonObject} from "../../Core/Decorator/SingletonObject";

@SingletonObject
export default class Question extends ASchema{
    protected _name: string = 'Survey';

    public getSchema(): mongoose.Schema {
        const schemaObject = new mongoose.Schema({
            title: String,
            answers: [new Answer().getSchema()]
        });

        return schemaObject;
    }

}