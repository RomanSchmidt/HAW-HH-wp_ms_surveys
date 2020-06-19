import AError from "./AError";

export default class InternalServerError extends AError{
    protected readonly _status:number = 500;
}