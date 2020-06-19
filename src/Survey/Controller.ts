import AController from "../Core/AController";
import {ControllerIncome} from "../Core/Declorator/ControllerIncome";

export default class Controller extends AController {

    constructor() {
        super();
    }

    public readonly get = {
        index: async (income: ControllerIncome): Promise<{}> => {
            this.log('index', income);
            return 'asdf';
        }
    };
    public readonly patch = {};
    public readonly post = {};
    public readonly put = {};
    protected readonly _path = 'survey';
}