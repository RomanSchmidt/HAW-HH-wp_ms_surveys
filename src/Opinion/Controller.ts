import AController from "../Core/AController";
import Service from "./Service";
import {ControllerIncome} from "../Core/Declorator/ControllerIncome";
import BadRequest from "../Core/Error/BadRequest";
import Validator from "./Validator";
import {ErrorType} from "../Core/Error/ErrorType";

export default class Controller extends AController {

    public readonly delete = {
        index: async (income: ControllerIncome): Promise<{}> => {
            const surveyId = this._validator.convertMongoIdString(income.query.surveyId);
            if (surveyId) {
                return this._service.removeBySurveyId(surveyId);
            }
            throw new BadRequest({field: 'surveyId', type: ErrorType.invalid});
        }
    };
    protected readonly _path = 'opinion';
    protected readonly _service = new Service();
    private _validator: Validator = new Validator();
    readonly patch = {};
    public readonly put = {
        ':id': async (income: ControllerIncome): Promise<{}> => {
            const id = this._validator.convertMongoIdString(income.params.id);
            if (id) {
                const body = this._validator.verifyUpdateExternal(income.body);
                return this._service.update(id, body);
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
        index: async (income: ControllerIncome): Promise<{}> => {
            if ('surveyId' in income.query) {
                const surveyId = this._validator.convertMongoIdString(income.query.surveyId);
                if (surveyId) {
                    return await this._service.getBySurveyId(income.query.surveyId, {});
                }
                throw new BadRequest({field: 'surveyId', type: ErrorType.invalid});
            }

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