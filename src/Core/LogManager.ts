import Tools from "./Tools";

export default class LogManager {
    public log(description: string, ...elements: any[]): void {
        const messagePrefix: string = this._getMessagePrefix();
        elements.length ?
            console.log(messagePrefix, description, ' <-> ', ...elements) :
            console.log(messagePrefix, description);
    }

    public logError(description: string, ...elements: any[]): void {
        const messagePrefix: string = this._getMessagePrefix();
        elements.length ?
            console.error(messagePrefix, description, ' <-> ', ...elements) :
            console.error(messagePrefix, description);
    }

    private _getMessagePrefix(): string {
        const stack = new Error().stack || '';
        return [
            '[',
            Tools.formatTime(Date.now(), true),
            '] ',
            (stack.split('\n')[4]?.replace(/^.+[\\\/]src([\\\/])([^\)]+)\)/i, '.$1$2') || ''),
            ' ->'
        ].join('');
    }
}