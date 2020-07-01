import App from "../Core/App";
import Controller from "./Controller";
import Opinion from "./Foreign/Opinion";

const app = new App(new Controller());
app.addForeignService(new Opinion());
app.start()
    .then(async () => {
        console.info('survey micro service has started');
    })
    .catch((err) => {
        console.error(err);
    })
;