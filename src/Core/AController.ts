import AObject from "./AObject";
import {ControllerIncome} from "./Declorator/ControllerIncome";

/**
 * register your self and your actions to app
 */
export default abstract class AController extends AObject {

    public readonly abstract get: { [key: string]: (income: ControllerIncome) => Promise<{}> };
    public readonly abstract post: { [key: string]: (income: ControllerIncome) => Promise<{}> };
    public readonly abstract put: { [key: string]: (income: ControllerIncome) => Promise<{}> };
    public readonly abstract patch: { [key: string]: (income: ControllerIncome) => Promise<{}> };
    protected abstract readonly _path: string;

    public async init(): Promise<void> {
        await super.init();
    }

    public getPath() {
        return this._path;
    }
}