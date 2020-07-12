import AObject from "./AObject";
import InternalServerError from "./Error/InternalServerError";
import {ErrorType} from "./Declarator/ErrorType";
import AError from "./Error/AError";
import fetch from "node-fetch";
import {ControllerOutgoings} from "./Declarator/ControllerOutgoings";
import {CollectionObject} from "./Declarator/CollectionObject";
import RequestForeignService from "./Error/ConnectForeignService";
import Tools from "./Helper/Tools";

type returnType = Promise<CollectionObject | CollectionObject[] | void>;

export default abstract class AForeignService extends AObject {
    public readonly abstract get: { [key: string]: (...argument: any[]) => returnType };
    public readonly abstract post: { [key: string]: (...argument: any[]) => returnType };
    public readonly abstract put: { [key: string]: (...argument: any[]) => returnType };
    public readonly abstract patch: { [key: string]: (...argument: any[]) => returnType };
    public readonly abstract delete: { [key: string]: (...argument: any[]) => returnType };
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

    protected async _performGetRequest<T extends CollectionObject[] | CollectionObject>(param: ControllerOutgoings): Promise<CollectionObject | CollectionObject[] | undefined> {
        return await this._performRequest<T>('GET', param);
    }

    protected async _performPatchRequest<T extends CollectionObject[] | CollectionObject>(param: ControllerOutgoings): Promise<CollectionObject | CollectionObject[] | undefined> {
        return await this._performRequest<T>('PATCH', param);
    }

    protected async _performPostRequest<T extends CollectionObject[] | CollectionObject>(param: ControllerOutgoings): Promise<CollectionObject | CollectionObject[] | undefined> {
        return await this._performRequest<T>('POST', param);
    }

    protected async _performDeleteRequest<T extends CollectionObject[] | CollectionObject>(param: ControllerOutgoings): Promise<CollectionObject | CollectionObject[] | undefined> {
        return await this._performRequest<T>('DELETE', param);
    }

    protected async _performPutRequest<T extends CollectionObject[] | CollectionObject>(param: ControllerOutgoings): Promise<CollectionObject | CollectionObject[] | undefined> {
        return await this._performRequest<T>('PUT', param);
    }

    protected async _performRequest<T extends CollectionObject[] | CollectionObject>(method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH', params: ControllerOutgoings): Promise<T | undefined> {
        let response;
        const url = this._createUrl(params);
        try {
            response = await fetch(url, {
                method: method,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(params.body) || undefined
            });
        } catch (err) {
            if (!(err instanceof AError)) {
                this.logError('Foreign_' + this.constructor.name + '_Service not reachable');
                return undefined;
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
        let returnValue;
        try {
            returnValue = await this._performGetRequest({params: ['health']});
        } catch (e) {
            if (e instanceof RequestForeignService) {
                this.log('connection retry to: ', this.getPath());
                await Tools.timeout(2000);
                await this._connect();
                return;
            } else {
                throw e;
            }
        }
        returnValue && this.log('Foreign Service connected: ' + this.constructor.name);
    }
}