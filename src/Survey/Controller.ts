import AController from "../Core/AController";
import {ControllerIncome} from "../Core/Declarator/ControllerIncome";
import Service from "./Service";
import BadRequest from "../Core/Error/BadRequest";
import Survey from "./Validator/Survey";
import {ErrorType} from "../Core/Declarator/ErrorType";

export default class Controller extends AController {
    protected readonly _path = 'survey';
    protected _service: Service = new Service();
    private _validator: Survey = new Survey();
    readonly patch = {
        ':id': async (income: ControllerIncome): Promise<{}> => {
            const id = this._validator.convertMongoIdString(income.params.id);
            if (id) {
                const query = this._validator.verifyIncreaseExternal(income.query);
                return await this._service.increase(id, query);
            }
            throw new BadRequest({field: 'id', type: ErrorType.invalid});
        }
    };
    public readonly delete = {
        ':id': async (income: ControllerIncome): Promise<{}> => {
            const id = this._validator.convertMongoIdString(income.params.id);
            if (id) {
                return await this._service.remove(id);
            }
            throw new BadRequest({field: 'id', type: ErrorType.invalid});
        }
    };
    public readonly put = {
        ':id': async (income: ControllerIncome): Promise<{}> => {
            const id = this._validator.convertMongoIdString(income.params.id);
            if (id) {
                const body = this._validator.verifyUpdateExternal(income.body);
                return await this._service.update(id, body);
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
        health: async (_income: ControllerIncome): Promise<{}> => {
            return {ok: true};
        },
        index: async (_income: ControllerIncome): Promise<{}> => {
            return await this._service.getAll({}, {});
        },
        ':id': async (income: ControllerIncome): Promise<{}> => {
            if (this._validator.convertMongoIdString(income.params.id)) {
                return await this._service.getById(income.params.id, {});
            }
            throw new BadRequest({field: 'id', type: ErrorType.invalid});
        }
    };

    public constructor() {
        super();
    }
}