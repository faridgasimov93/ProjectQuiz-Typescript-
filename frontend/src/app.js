import {Router} from "./router.js";

class App {
    constructor() {
        this.rounter = new Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }

    handleRouteChanging() {
        this.rounter.openRoute();
    }
}

(new App());