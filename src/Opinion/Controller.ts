import AController from "../Core/AController";
import Service from "./Service";
import {ControllerIncome} from "../Core/Declarator/ControllerIncome";
import BadRequest from "../Core/Error/BadRequest";
import Validator from "./Validator";
import {ErrorType} from "../Core/Declarator/ErrorType";
import UnknownResource from "../Core/Error/UnknownResource";

export default class Controller extends AController {

    readonly patch = {};
    public readonly put = {};
    protected readonly _path = 'opinion';
    protected readonly _service = new Service();
    private _validator: Validator = new Validator();
    public readonly delete = {
        index: async (income: ControllerIncome): Promise<{}> => {
            const surveyId = this._validator.convertMongoIdString(income.query.surveyId);
            if (surveyId) {
                return await this._service.removeBySurveyId(surveyId);
            }
            throw new BadRequest({field: 'surveyId', type: ErrorType.invalid});
        }
    };
    public readonly post = {
        index: async (income: ControllerIncome): Promise<{}> => {
            const body = this._validator.verifyInsertExternal(income.body);
            return await this._service.create(body);
        }
    };
    public readonly get = {
        health: async (_income: ControllerIncome): Promise<{}> => {
            return {ok: true};
        },
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
                const opinion = await this._service.getById(income.params.id, {});
                if (!opinion) {
                    throw new UnknownResource({field: 'opinion', type: ErrorType.unknown});
                }
                return opinion;
            }
            throw new BadRequest({field: 'id', type: ErrorType.invalid});
        }
    };

    public constructor() {
        super();
    }
}