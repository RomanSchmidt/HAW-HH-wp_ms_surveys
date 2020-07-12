import AObject from "../AObject";
import AError from "../Error/AError";
import {ErrorResult} from "../Declarator/ErrorResult";
import {Environment} from "../Declarator/Environment";
import App from "../App";

export default class ErrorHandler extends AObject {

    public analyze(error: Error): { status: number, message: ErrorResult } {
        if (!(error instanceof Error)) {
            this.logError('error is not instance of AError', error);
            return {status: 400, message: error}
        }
        if (error instanceof AError) {
            return {status: error.getStatus(), message: error.getMessage()};
        }
        if(App.ENVIRONMENT == Environment.Development) {
            throw error;
        }
        return {
            status: 500,
            message: error?.message || (<any>error)
        };
    }
}