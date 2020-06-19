import * as should from "should";
import AObject from "../../Core/AObject";

export class CreateOpinion extends AObject {

    constructor() {
        super();
        describe("create Survey", () => {
            this._run();
        });
    }

    private _run(): void {
        it('should do nothing', () => {
            console.log("foo");
            should.equal(true, false);
        });
    }
}

new CreateOpinion();