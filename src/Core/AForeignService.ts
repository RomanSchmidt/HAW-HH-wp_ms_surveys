import AObject from "./AObject";
import InternalServerError from "./Error/InternalServerError";
import {ErrorType} from "./Error/ErrorType";
import AError from "./Error/AError";
import fetch from "node-fetch";
import {ControllerOutgoings} from "./Declorator/ControllerOutgoings";
import {CollectionObject} from "./Declorator/CollectionObject";
import RequestForeignService from "./Error/ConnectForeignService";
import Tools from "./Helper/Tools";

type returnType = Promise<CollectionObject | CollectionObject[] | void>;

export default abstract class AForeignService extends AObject {
    private static _maxConnectionRetries = 10;
    public readonly abstract get: { [key: string]: (...argument: any[]) => returnType };
    public readonly abstract post: { [key: string]: (...argument: any[]) => returnType };
    public readonly abstract put: { [key: string]: (...argument: any[]) => returnType };
    public readonly abstract patch: { [key: string]: (...argument: any[]) => returnType };
    public readonly abstract delete: { [key: string]: (...argument: any[]) => returnType };
    protected abstract readonly _path: string;
    private _needInit: boolean = true;
    private _connectionRetry = 0;

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

    protected async _performGetRequest<T extends CollectionObject[] | CollectionObject>(param: ControllerOutgoings): Promise<CollectionObject | CollectionObject[]> {
        return await this._performRequest<T>('GET', param);
    }

    protected async _performPatchRequest<T extends CollectionObject[] | CollectionObject>(param: ControllerOutgoings): Promise<CollectionObject | CollectionObject[]> {
        return await this._performRequest<T>('PATCH', param);
    }

    protected async _performPostRequest<T extends CollectionObject[] | CollectionObject>(param: ControllerOutgoings): Promise<CollectionObject | CollectionObject[]> {
        return await this._performRequest<T>('POST', param);
    }

    protected async _performDeleteRequest<T extends CollectionObject[] | CollectionObject>(param: ControllerOutgoings): Promise<CollectionObject | CollectionObject[]> {
        return await this._performRequest<T>('DELETE', param);
    }

    protected async _performPutRequest<T extends CollectionObject[] | CollectionObject>(param: ControllerOutgoings): Promise<CollectionObject | CollectionObject[]> {
        return await this._performRequest<T>('PUT', param);
    }

    protected async _performRequest<T extends CollectionObject[] | CollectionObject>(method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH', params: ControllerOutgoings): Promise<T> {
        let response;
        const url = this._createUrl(params);
        this.log('requesting: ', {method, url});
        try {
            response = await fetch(url, {
                method: method,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(params.body) || undefined
            });
        } catch (err) {
            if (!(err instanceof AError)) {
                throw new RequestForeignService({
                    field: 'Foreign_' + this.constructor.name + '_Service',
                    type: ErrorType.unknown
                });
            } else {
                throw err;
            }
        }
        if (response.status >= 400) {
            this.logError('serverResult', {url, method, status: response.status, headers: response.headers});
            throw new InternalServerError({
                field: 'Foreign_Service_' + this.constructor.name + '_Request',
                type: ErrorType.invalid
            });
        }
        const json = await response.json();
        return <any>json.success;
    }

    private _createUrl(params: ControllerOutgoings): string {
        let url = this.getPath();
        if (params.params?.length) {
            if (!url.endsWith('/')) {
                url += '/';
            }
            url += params.params.join('/');
        }
        if (params.query) {
            url += '?';
            for (const key in params.query) {
                url += key + '=' + params.query[key];
            }
        }
        return url;
    }

    private async _connect(): Promise<void> {
        try {
            await this._performGetRequest({});
        } catch (e) {
            if (e instanceof RequestForeignService) {
                ++this._connectionRetry;
                if (this._connectionRetry > AForeignService._maxConnectionRetries) {
                    throw e;
                } else {
                    this.log('connection retry #' + this._connectionRetry + '  to: ', this.getPath());
                    await Tools.timeout(1000);
                    await this._connect();
                    return;
                }
            } else {
                throw e;
            }
        }
        this.log('Foreign Service connected: ' + this.constructor.name);
    }
}