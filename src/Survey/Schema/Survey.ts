import ASchema from "../../Core/ASchema";
import * as mongoose from "mongoose";
import Question from "./Question";
import {SingletonObject} from "../../Core/Decorator/SingletonObject";

@SingletonObject
export default class Survey extends ASchema {
    protected _name: string = 'Survey';

    public getSchema(): mongoose.Schema {
        const schemaObject = new mongoose.Schema({
            title: String,
            questions: [new Question().getSchema()],
            userCounter: {type: Number, default: 0}
        });

        schemaObject.index({userCounter: 1}, {background: true, name: 'counter'});

        return schemaObject;
    }

}