import App from "../Core/App";
import Controller from "./Controller";

const app = new App();
app.addController(new Controller())
    .then(() => {
        app.start();
    })
    .catch((err) => {
        console.error(err);
    })
;