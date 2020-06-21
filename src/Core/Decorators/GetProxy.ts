import AObject from "../AObject";

const SINGLETON_KEY = Symbol('Singleton');

export function getProxy<T extends new (...args: any[]) => any, V extends AObject>(classTarget: T) {
    return new Proxy(classTarget, {
        construct(target: T & { [SINGLETON_KEY]: V }, argumentList: any, newTarget?: any): object {
            // Skip proxy for children
            if (target.prototype !== newTarget.prototype) {
                return Reflect.construct(target, argumentList, newTarget);
            }
            if (!target.hasOwnProperty(SINGLETON_KEY)) {
                target[SINGLETON_KEY] = Reflect.construct(target, argumentList, newTarget);
            }
            return target[SINGLETON_KEY];
        }
    });
}