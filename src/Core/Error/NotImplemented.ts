import AError from "./AError";

export default class NotImplemented extends AError {
    protected readonly _status: number = 501;
}