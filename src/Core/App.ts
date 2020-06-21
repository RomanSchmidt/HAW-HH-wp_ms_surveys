import AObject from "./AObject";
import AController from "./AController";
import * as express from "express";
import ErrorHandler from "./ErrorHandler";
import {Db} from "./Db";
import compression = require("compression");
import morgan = require("morgan");
import bodyParser = require("body-parser");
import helmet = require("helmet");

/**
 * init and handle express
 */
export default class App extends AObject {
    private readonly _express: express.Express = express();
    private readonly _routes: { [key: string]: express.Router } = {};

    private _errorHandler: ErrorHandler = new ErrorHandler();

    public constructor() {
        super();
        this._initExpress();
    }

    /**
     * @todo make port configurable
     */
    public async start(): Promise<void> {
        this._registerRouters();
        this._initErrorHandle();
        this._express.listen(8081, () => {
            this.log('server has started on', 8081);
        });
        const db = new Db();
        return db.init();
    }

    public async addController(controller: AController) {
        await controller.init();
        const router = this._getRouter(controller.getPath());
        for (let actionName in controller.get) {
            const functionName = actionName;
            if (actionName == 'index') {
                actionName = '';
            }
            this.log('adding route', 'GET-> /' + controller.getPath() + '/' + actionName);
            router.get('/' + actionName, (req, res) => {
                controller.get[functionName]({
                    body: req.body,
                    params: req.params,
                    query: req.query
                })
                    .then(result => {
                        res.status(200).json({error: null, success: result || null});
                    })
                    .catch((err: Error) => {
                        const {status, message} = this._errorHandler.analyze(err);
                        res.status(status).json({error: message, success: null});
                    })
                ;
            });
        }
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
        // @todo figure out if it is dev
        //if(isDev) {
        //    this._express.use(morgan('dev'));
        //} else {
        this._express.use(morgan('combined', {
            skip: function (_req, res) {
                return res.statusCode < 400
            }
        }));
        //}
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
                    error: req.method + ': ' + JSON.stringify({
                        url: req.url,
                        host: req.headers.host,
                        method: req.method
                    }) + ' is not registered!', result: null
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