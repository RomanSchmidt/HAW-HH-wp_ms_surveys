import LogManager from "./Logmanager";

export default abstract class AObject {
    private readonly _logManager: LogManager;

    protected constructor() {
        this._logManager = new LogManager();
    }

    public async init(): Promise<void> {
        return;
    }

    protected log(description: string, ...elemetns: any[]): void {
        this._logManager.log(description, ...elemetns);
    }

    protected logError(description: string, ...elemetns: any[]): void {
        this._logManager.logError(description, ...elemetns);
    }
}