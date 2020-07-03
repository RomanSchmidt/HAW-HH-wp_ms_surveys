import {Types} from "mongoose";

type types =
    number
    | string
    | CollectionObject
    | boolean
    | Date
    | Buffer
    | Types.ObjectId;

export type CollectionObject = { [key: string]: types | types[] };