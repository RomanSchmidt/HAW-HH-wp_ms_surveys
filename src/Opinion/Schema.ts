import ASchema from "../Core/ASchema";
import * as mongoose from "mongoose";

export default class Schema extends ASchema {
    protected _name = 'Schema';

    public getSchema(): mongoose.Schema {
        return new mongoose.Schema({
            answers: [{type: mongoose.Types.ObjectId}]
        });
    }
}