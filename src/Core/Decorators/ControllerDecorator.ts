import AController from "../AController";

export const ControllerDecorator = function (apiPath: string) {
    console.log("controller with: " + apiPath)
    return <T extends typeof AController>(classTarget: T): T => {
        const proxyInstance = new Proxy(classTarget, {
            construct(target: T, argArray: any, newTarget?: any): object {
                //target._path = apiPath;
                //target.prototype.setPath(apiPath);
                //console.log('alsdfjk', target.prototype.getPath());
                return Reflect.construct(target, argArray, newTarget);
            }
        });
        //App.registerController(apiPath, proxyInstance);
        return proxyInstance;
    }
}