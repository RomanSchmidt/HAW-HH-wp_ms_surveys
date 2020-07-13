import {Environment} from "../Declarator/Environment";
import Arguments from "./Arguments";

export default abstract class Tools {

    private constructor() {
    }

    public static timeout(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static formatTime(dateValue: number | Date, withTime: boolean): string {
        let
            date = new Date(dateValue),
            month = (date.getMonth() + 1).toString(),
            day = date.getDate().toString(),
            year = date.getFullYear();

        month.length < 2 && (month = '0' + month);
        day.length < 2 && (day = '0' + day);

        let returnValue = [year, month, day].join('-');
        if (withTime) {
            let
                hours = date.getHours(),
                minutes = date.getMinutes(),
                seconds = date.getSeconds(),
                milliseconds = date.getMilliseconds()
            ;

            returnValue += ' ' + [hours, minutes, seconds, milliseconds].join(':')
        }
        return returnValue;
    }

    public static getEnvironment(): Environment {
        if (process.env.NODE_ENV) {
            const environment = <Environment | undefined>this.getEnumValues(Environment).find(value => {
                return value === process.env.NODE_ENV;
            });
            if (environment) {
                return environment;
            }
        }
        return typeof global.it === 'function' ? Environment.Test :
            Arguments.get('ENVIRONMENT').ENVIRONMENT == Environment.Production ? Environment.Production :
                Environment.Development
            ;
    }

    public static getEnumValues(someEnum: any): string[] {
        const names: string[] = [];
        for (const key in someEnum) {
            names.push(someEnum[key].toString && someEnum[key].toString() || someEnum[key]);
        }
        return names;
    }
}