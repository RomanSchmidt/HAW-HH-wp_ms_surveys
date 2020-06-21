import {Schema} from "mongoose";

export default abstract class ASchema {
    protected abstract _name: string;

    public abstract getSchema(): Schema;

    public getName(): string {
        return this._name;
    }
}