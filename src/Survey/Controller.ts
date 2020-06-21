import AController from "../Core/AController";
import {ControllerIncome} from "../Core/Declorator/ControllerIncome";
import Service from "./Service";
import BadRequest from "../Core/Error/BadRequest";
import Validator from "./Validator";

export default class Controller extends AController {
    public readonly patch = {};
    public readonly post = {};
    public readonly put = {};

    protected readonly _path = 'survey';
    protected _service: Service = new Service();
    private _validator: Validator = new Validator();

    public readonly get = {
        index: async (_income: ControllerIncome): Promise<{}> => {
            return this._service.getAll({}, {});
        },
        ':id': async (income: ControllerIncome): Promise<{}> => {
            if (this._validator.convertMongoIdString(income.params.id)) {
                return this._service.getById(income.params.id, {});
            }
            throw new BadRequest('id invalid');
        }
    };

    public constructor() {
        super();
    }
}