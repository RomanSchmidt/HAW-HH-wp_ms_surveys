export default abstract class Tools {

    private constructor() {
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
}