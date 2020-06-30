import AController from "../Core/AController";
import Service from "./Service";
import {ControllerIncome} from "../Core/Declorator/ControllerIncome";
import BadRequest from "../Core/Error/BadRequest";
import Validator from "./Validator";
import {ErrorType} from "../Core/Error/ErrorType";

export default class Controller extends AController {

    public readonly delete = {};
    protected readonly _path = 'opinion';
    protected readonly _service = new Service();
    private _validator: Validator = new Validator();
    public readonly put = {
        ':id': async (income: ControllerIncome): Promise<{}> => {
            if (this._validator.convertMongoIdString(income.params.id)) {
                const body = this._validator.verifyInsertExternal(income.body);
                return this._service.create(body);
            }
            throw new BadRequest({field: 'id', type: ErrorType.invalid});
        }
    };
    public readonly post = {
        index: async (income: ControllerIncome): Promise<{}> => {
            const body = this._validator.verifyInsertExternal(income.body);
            return this._service.create(body);
        }
    };
    public readonly get = {
        index: async (_income: ControllerIncome): Promise<{}> => {
            return this._service.getAll({}, {});
        },
        ':id': async (income: ControllerIncome): Promise<{}> => {
            if (this._validator.convertMongoIdString(income.params.id)) {
                return this._service.getById(income.params.id, {});
            }
            throw new BadRequest({field: 'id', type: ErrorType.invalid});
        }
    };

    public constructor() {
        super();
    }
}