import AObject from "./AObject";
import AController from "./AController";
import * as express from "express";
import ErrorHandler from "./ErrorHandler";
import {Db} from "./Db";
import Arguments from "./Helper/Arguments";
import {Environment} from "./Declorator/Environment";
import compression = require("compression");
import morgan = require("morgan");
import bodyParser = require("body-parser");
import helmet = require("helmet");

/**
 * init and handle express
 */
export default class App extends AObject {
    public static readonly ENVIRONMENT = Arguments.get('ENVIRONMENT').ENVIRONMENT == Environment.Production ? Environment.Production : Environment.Development;
    private readonly _express: express.Express = express();
    private readonly _routes: { [key: string]: express.Router } = {};
    private _errorHandler: ErrorHandler = new ErrorHandler();

    public constructor() {
        super();
        this._initExpress();
    }

    public async start(): Promise<void> {
        this._registerRouters();
        this._initErrorHandle();
        const port = Arguments.get('PORT').PORT || 8080;
        this._express.listen(port, () => {
            this.log('server has started on', port);
        });
        const db = new Db();
        return db.init();
    }

    public async addController(controller: AController) {
        await controller.init();

        for (let actionName in controller.get) {
            this._registerMethod('get', controller, actionName);
        }
        for (let actionName in controller.post) {
            this._registerMethod('post', controller, actionName);
        }
        for (let actionName in controller.put) {
            this._registerMethod('put', controller, actionName);
        }
        for (let actionName in controller.delete) {
            this._registerMethod('delete', controller, actionName);
        }
    }

    private _registerMethod(method: 'get' | 'put' | 'post' | 'delete', controller: AController, actionName: string): void {
        const functionName = actionName;
        actionName == 'index' && (actionName = '');

        this.log('adding route', method.toUpperCase() + ' -> /' + controller.getPath() + '/' + actionName);

        const router = this._getRouter(controller.getPath());
        router[method]('/' + actionName, (req, res) => {
            controller[method][functionName]({
                body: req.body,
                params: req.params,
                query: req.query
            })
                .then(result => {
                    res.status(200).json({error: null, success: result === undefined ? null : result});
                })
                .catch((err: Error) => {
                    const foo = this._errorHandler.analyze(err);
                    res.status(foo.status).json({error: foo.message, success: null});
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
            res.header('Access-Controll-Allow-Methods', 'GET,PUT,POST,DELETE');
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

    private _registerRouters() {
        for (const routerName in this._routes) {
            this._express.use('/' + routerName, this._routes[routerName]);
        }
    }
}