import AObject from "./AObject";
import {ControllerIncome} from "./Declorator/ControllerIncome";
import AService from "./AService";
import AModel from "./AModel";
import AValidator from "./AValidator";
import ASchema from "./ASchema";

/**
 * register your self and your actions to app
 */
export default abstract class AController extends AObject {

    public readonly abstract get: { [key: string]: (income: ControllerIncome) => Promise<{}> };
    public readonly abstract post: { [key: string]: (income: ControllerIncome) => Promise<{}> };
    public readonly abstract put: { [key: string]: (income: ControllerIncome) => Promise<{}> };
    public readonly abstract delete: { [key: string]: (income: ControllerIncome) => Promise<{}> };

    protected abstract readonly _path: string;
    protected abstract readonly _service: AService<AModel<AValidator, ASchema>>;

    async init(): Promise<void> {
        await super.init();
        await this._service.init();
    }

    public getPath() {
        return this._path;
    }
}