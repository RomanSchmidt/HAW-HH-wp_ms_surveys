import AError from "./AError";

export default class UnknownResource extends AError {
    protected readonly _status: number = 404;
}