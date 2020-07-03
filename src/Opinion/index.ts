import App from "../Core/App";
import Controller from "./Controller";
import Survey from "./Foreign/Survey"

const app = new App(new Controller());
app.addForeignService(new Survey());
app.start()
    .then(async () => {
        console.log('opinion microservice has started');
    })
    .catch((err) => {
        console.error(err);
    })
;