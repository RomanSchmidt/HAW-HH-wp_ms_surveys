import AForeignService from "../../Core/AForeignService";
import * as mongoose from "mongoose";
import {CollectionObject} from "../../Core/Declorator/CollectionObject";
import {SingletonObject} from "../../Core/Decorator/SingletonObject";
import Arguments from "../../Core/Helper/Arguments";

@SingletonObject
export default class Opinion extends AForeignService {
    public readonly delete = {
        bySurveyId: async (surveyId: mongoose.Types.ObjectId): Promise<CollectionObject> => {
            return <CollectionObject>await this._performDeleteRequest({query: {surveyId}});
        }
    };
    readonly get = {
        forSurvey: async (surveyId: mongoose.Types.ObjectId): Promise<CollectionObject[]> => {
            return <CollectionObject[]>await this._performGetRequest({query: {surveyId}});
        },
    };
    readonly post = {};
    readonly put = {};
    readonly patch = {};
    protected readonly _path: string = Arguments.get('FOREIGN_SERVICE_OPINION').FOREIGN_SERVICE_OPINION || 'http://localhost:8081/opinion';

    public constructor() {
        super();
    }
}