import AObject from "./AObject";
import AError from "./Error/AError";

export default class ErrorHandler extends AObject {

    public analyze(error: Error): { status: number, message: string } {
        if (!(error instanceof Error)) {
            this.logError('error is not instance of AError', error);
            return {status: 400, message: error}
        }
        if (error instanceof AError) {
            return {status: error.getStatus(), message: error.getMessage()}
        }
        return {
            status: 500,
            message: error?.message || (<any>error).toString && (<any>error).toString() || (<any>error)
        };
    }
}