import AForeignService from "../../Core/AForeignService";
import {SingletonObject} from "../../Core/Decorator/SingletonObject";
import * as mongoose from "mongoose";
import {CollectionObject} from "../../Core/Declorator/CollectionObject";
import Arguments from "../../Core/Helper/Arguments";

@SingletonObject
export default class Survey extends AForeignService {
    public readonly delete = {};
    readonly patch = {
        incUserCounter: async (surveyId: mongoose.Types.ObjectId): Promise<void> => {
            await this._performPatchRequest({query: {userCounter: 1}, params: [surveyId.toString()]});
        }
    };
    readonly post = {
        create: async (body: CollectionObject): Promise<CollectionObject> => {
            return <CollectionObject>await this._performPostRequest({body});
        }
    };
    readonly put = {};
    readonly get = {
        byId: async <T extends CollectionObject[] | CollectionObject>(surveyId: mongoose.Types.ObjectId): Promise<T> => {
            return <T>await this._performGetRequest<T>({params: [surveyId.toString()]});
        }
    };
    protected readonly _path: string = Arguments.get('FOREIGN_SERVICE_SURVEY').FOREIGN_SERVICE_SURVEY || 'http://localhost:8080/survey';

    public constructor() {
        super();
    }
}