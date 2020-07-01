import App from "../Core/App";
import Controller from "./Controller";

const app = new App(new Controller());
app.start()
    .then(async () => {
        console.log('opinion microservice has started');
    })
    .catch((err) => {
        console.error(err);
    })
;