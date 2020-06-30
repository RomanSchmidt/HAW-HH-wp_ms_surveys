import AValidator from "../Core/AValidator";
import NotImplemented from "../Core/Error/NotImplemented";
import {CollectionObject} from "../Core/Declorator/CollectionObject";
import {SingletonObject} from "../Core/Decorator/SingletonObject";
import {ErrorType} from "../Core/Error/ErrorType";

@SingletonObject
export default class Validator extends AValidator {
    constructor() {
        super();
    }

    public verifyInsert<T extends CollectionObject>(payload: T = <T>{}): typeof payload {
        throw new NotImplemented({field: 'insertOpinion', type: ErrorType.empty});
        return <T>{};
    }

    public verifyUpdate<T extends CollectionObject>(payload: T = <T>{}): typeof payload {
        throw new NotImplemented({field: 'updateOpinion', type: ErrorType.empty});
        return <T>{};
    }

    public verifyInsertExternal<T extends CollectionObject>(payload: T = <T>{}): typeof payload {
        throw new NotImplemented({field: 'insertExternalOpinion', type: ErrorType.empty});
        return <T>{};
    }

    public verifyUpdateExternal<T extends CollectionObject>(payload: T = <T>{}): typeof payload {
        throw new NotImplemented({field: 'updateExternalOpinion', type: ErrorType.empty});
        return <T>{};
    }
}