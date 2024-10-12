import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";

export class Result {

    constructor() {
        this.routeParams = UrlManager.getQueryParams();

        const id = this.routeParams.id;
        const results = this.routeParams.results;
        const score = this.routeParams.score + '/' + this.routeParams.total;

        const name = this.routeParams.name;
        const lastName = this.routeParams.lastName;
        const email = this.routeParams.email;

        this.init();

        const resultLink = document.querySelector('.result__link a');
        resultLink.addEventListener('click', function (event) {
            event.preventDefault();
            location.href = '#/answers?id=' + id + '&score=' + score + '&name=' + name + '&lastName=' + lastName + '&email=' + email + '&results=' + results;
        });
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '/#';
        }

        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId);

                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    document.getElementById('result-score').innerText = result.score + '/' + result.total;
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
        location.href = '/#';
    }
}
