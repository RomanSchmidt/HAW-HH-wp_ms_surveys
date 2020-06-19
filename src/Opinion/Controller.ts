import AController from "../Core/AController";

export default class Controller extends AController {

    public constructor() {
        super();
    }

    public readonly  get = {};
    public readonly  patch = {};
    public readonly  post = {};
    public readonly  put = {};
    protected readonly _path = 'opinion';
}