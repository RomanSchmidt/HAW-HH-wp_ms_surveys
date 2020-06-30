import * as minimist from "minimist";

export default abstract class Arguments {
    private static readonly _argumentsMap = minimist(process.argv.slice(2));

    private constructor() {
    }

    public static get(...keys: string[]): { [key: string]: string } {
        const returnValue: { [key: string]: string } = {};
        for (const key of keys) {
            returnValue[key] = Arguments._argumentsMap[key] || undefined;
        }
        return returnValue;
    }
}