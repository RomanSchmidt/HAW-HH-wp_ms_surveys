import AError from "./AError";

export default class BadRequest extends AError{
    protected readonly _status:number = 400;
}