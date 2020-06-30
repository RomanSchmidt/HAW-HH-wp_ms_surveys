import AObject from "../AObject";
import {getProxy} from "./GetProxy";

export const SingletonObject = <T extends new (...args: any[]) => any>(classTarget: T) => {
    return getProxy<T, AObject>(classTarget);
}