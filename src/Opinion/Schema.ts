import ASchema from "../Core/ASchema";
import * as mongoose from "mongoose";

export default class Schema extends ASchema {
    protected _name = 'Schema';

    public getSchema(): mongoose.Schema {
        const schema = new mongoose.Schema({
            surveyId: {type: mongoose.Types.ObjectId, ref: 'Survey'},
            response: [{
                questionId: {type: mongoose.Types.ObjectId, ref: 'Survey.questions'},
                answerIds: [{type: mongoose.Types.ObjectId, ref: 'Survey.questions.answers'}]
            }]
        });

        schema.index({surveyId: 1}, {background: true, name: 'bySurveyId'});

        return schema;
    }
}