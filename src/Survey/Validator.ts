import AValidator from "../Core/AValidator";
import * as mongoose from "mongoose";
import NotImplemented from "../Core/Error/NotImplemented";

export default class Validator extends AValidator{
    public verifyInsert(payload: { [p: string]: typeof mongoose.Types }): typeof payload {
        throw new NotImplemented('implement insert survey');
        return {};
    }

    public verifyUpdate(payload: { [p: string]: typeof mongoose.Types }): typeof payload {
        throw new NotImplemented('implement update survey validation');
        return {};
    }
}