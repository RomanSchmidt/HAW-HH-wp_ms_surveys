import {Schema} from "mongoose";

type types =
    number
    | string
    | CollectionObject
    | boolean
    | Date
    | Buffer
    | Schema.Types.ObjectId
    | Schema.Types.Mixed;

export type CollectionObject = { [key: string]: types | types[] };