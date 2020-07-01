import AObject from "./AObject";
import InternalServerError from "./Error/InternalServerError";
import {ErrorType} from "./Error/ErrorType";
import AError from "./Error/AError";
import fetch from "node-fetch";
import {ControllerOutgoings} from "./Declorator/ControllerOutgoings";
import {CollectionObject} from "./Declorator/CollectionObject";

export default abstract class AForeignService extends AObject {
    public readonly abstract get: { [key: string]: (...argument: any[]) => Promise<CollectionObject | CollectionObject[]> };
    public readonly abstract post: { [key: string]: (...argument: any[]) => Promise<CollectionObject | CollectionObject[]> };
    public readonly abstract put: { [key: string]: (...argument: any[]) => Promise<CollectionObject | CollectionObject[]> };
    public readonly abstract delete: { [key: string]: (...argument: any[]) => Promise<CollectionObject | CollectionObject[]> };
    protected abstract readonly _path: string;
    private _needInit: boolean = true;

    public getPath(): string {
        return this._path;
    }

    public async init(): Promise<void> {
        if (!this._needInit) {
            return;
        }

        this._needInit = false;
        await super.init();
        await this._connect();
    }

    protected async _performGetRequest(param: ControllerOutgoings): Promise<CollectionObject | CollectionObject[]> {
        return await this._performRequest('GET', param);
    }

    protected async _performPostRequest(param: ControllerOutgoings): Promise<CollectionObject | CollectionObject[]> {
        return await this._performRequest('POST', param);
    }

    protected async _performDeleteRequest(param: ControllerOutgoings): Promise<CollectionObject | CollectionObject[]> {
        return await this._performRequest('DELETE', param);
    }

    protected async _performPutRequest(param: ControllerOutgoings): Promise<CollectionObject | CollectionObject[]> {
        return await this._performRequest('PUT', param);
    }

    // @todo user params.params + params.query
    protected async _performRequest(method: 'GET' | 'POST' | 'DELETE' | 'PUT', params: ControllerOutgoings): Promise<CollectionObject[] | CollectionObject> {
        let response;
        try {
            response = await fetch(this.getPath(), {
                method: method,
                body: JSON.stringify(params.body) || undefined
            });
        } catch (err) {
            if (!(err instanceof AError)) {
                this.logError(err);

                throw new InternalServerError({
                    field: 'Foreign_' + this.constructor.name + '_Service',
                    type: ErrorType.unknown
                });
            } else {
                throw err;
            }
        }
        if (response.status >= 400) {
            this.logError('serverResult', {path: this.getPath(), status: response.status, headers: response.headers});
            throw new InternalServerError({
                field: 'Foreign_Service_' + this.constructor.name,
                type: ErrorType.invalid
            });
        }
        const json = await response.json();
        return <any>json.success;
    }

    private async _connect(): Promise<void> {
        await this._performRequest('GET', {});
        this.log('Foreign Service connected: ' + this.constructor.name);
    }
}