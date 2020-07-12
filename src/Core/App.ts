import AObject from "./AObject";
import AController from "./AController";
import * as express from "express";
import ErrorHandler from "./Helper/ErrorHandler";
import {Db} from "./Db";
import Arguments from "./Helper/Arguments";
import {Environment} from "./Declarator/Environment";
import InternalServerError from "./Error/InternalServerError";
import {ErrorType} from "./Declarator/ErrorType";
import AForeignService from "./AForeignService";
import Tools from "./Helper/Tools";
import compression = require("compression");
import morgan = require("morgan");
import bodyParser = require("body-parser");
import helmet = require("helmet");

/**
 * init and handle express
 */
export default class App extends AObject {
    public static readonly ENVIRONMENT = Tools.getEnvironment();
    private readonly _express: express.Express = express();
    private readonly _routes: { [key: string]: express.Router } = {};
    private _errorHandler: ErrorHandler = new ErrorHandler();
    private readonly _controller: AController;
    private readonly _foreignServices: AForeignService[] = [];
    private _hasStarted: boolean = false;

    public constructor(controller: AController) {
        super();
        this._controller = controller;
        this._initExpress();
    }

    public async start(): Promise<void> {
        if (this._hasStarted) {
            throw new InternalServerError({field: 'app start', type: ErrorType.ambiguous});
        }
        this._hasStarted = true;
        await this.init();
    }

    public async init(): Promise<void> {
        await super.init();
        await this._registerRouter();
        const port = Arguments.get('PORT').PORT || 8080;
        this._express.listen(port, () => {
            this.log('server has started on', port);
        });
        const db = new Db();
        await db.init();
        await this._initForeignServices();
    }

    public addForeignService(service: AForeignService): void {
        this._foreignServices.push(service);
    }

    private _registerMethod(method: 'get' | 'put' | 'post' | 'delete' | 'patch', controller: AController, actionName: string): void {
        const functionName = actionName;
        actionName == 'index' && (actionName = '');

        this.log('adding route', method.toUpperCase() + ' -> /' + controller.getPath() + '/' + actionName);

        const router = this._getRouter(controller.getPath());
        router[method]('/' + actionName, async (req, res) => {
            await controller[method][functionName]({
                body: req.body,
                params: req.params,
                query: req.query
            })
                .then(result => {
                    res.status(200).json({error: null, success: result === undefined ? null : result});
                })
                .catch((err: Error) => {
                    let analyzeResult
                    try {
                        analyzeResult = this._errorHandler.analyze(err);
                    } catch (e) {
                        this.logError('unknown Error', err);
                        res.status(500).json({error: err.message, success: null});
                        return;
                    }
                    if (analyzeResult.status >= 500) {
                        this.logError('internal Exception', err);
                    }
                    res.status(analyzeResult.status).json({error: analyzeResult.message, success: null});
                })
            ;
        });
    }

    private _getRouter(routerName: string): express.Router {
        if (!this._routes[routerName]) {
            this._routes[routerName] = express.Router();
        }
        return this._routes[routerName];
    }

    private _initExpress(): void {
        this._express.use(compression());
        this._initCores();
        if (App.ENVIRONMENT == Environment.Development) {
            this._express.use(morgan('dev'));
        } else {
            this._express.use(morgan('combined', {
                skip: function (_req, res) {
                    return res.statusCode < 400
                }
            }));
        }
        this._express.use(bodyParser.urlencoded({extended: false}));
        this._express.use(bodyParser.json({limit: 10 * 1024 * 1024}));
        this._express.use(helmet());
    }

    private _initCores(): void {
        this._express.use((req, res, next) => {
            res.header('Access-Controll-Allow-Credentials', 'true');
            res.header('Access-Controll-Allow-Origin', req.headers.origin);
            res.header('Access-Controll-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
            res.header('Access-Controll-Allow-HEADERS', 'X-Requested-With, Authorizatoin, X-HTTP-Method-Override, Content-Type, Accept');
            undefined === req.headers.orign && res.header("Cache-Control", "no-cache");
            if ('OPTIONS' === req.method) {
                res.sendStatus(200);
                return
            }
            next();
        });
    }

    private _initErrorHandle(): void {
        this._express.use((req, res, _next) => {
            try {
                res.status(404).send({
                    error: req.method + ': ' + [
                        'url: ' + req.url,
                        'host: ' + req.headers.host,
                        'method: ' + req.method
                    ].join('; ') + ' is not registered!', result: null
                });
            } catch (e) {
                res.status(404).send({error: 'internal'});
            }
        });

        this._express.use((err: Error, _req: express.Request, res: express.Response, _next: () => void) => {
            console.error(err);
            res.status(500).json({error: 'internal Exception', success: null});
        });
    }

    private async _registerRouter(): Promise<void> {
        if (!this._controller) {
            throw new InternalServerError({field: 'controller', type: ErrorType.empty});
        }
        await this._controller.init();

        for (let actionName in this._controller.get) {
            this._registerMethod('get', this._controller, actionName);
        }
        for (let actionName in this._controller.post) {
            this._registerMethod('post', this._controller, actionName);
        }
        for (let actionName in this._controller.put) {
            this._registerMethod('put', this._controller, actionName);
        }
        for (let actionName in this._controller.patch) {
            this._registerMethod('patch', this._controller, actionName);
        }
        for (let actionName in this._controller.delete) {
            this._registerMethod('delete', this._controller, actionName);
        }

        for (const routerName in this._routes) {
            this._express.use('/' + routerName, this._routes[routerName]);
        }

        // @note need to be called at the end!!!
        this._initErrorHandle();
    }

    private async _initForeignServices(): Promise<void> {
        if (!this._foreignServices.length) {
            return;
        }
        const initList: Promise<void>[] = [];
        this._foreignServices.forEach(service => initList.push(service.init()));
        await Promise.all(initList);
    }
}