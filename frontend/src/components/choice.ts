import {UrlManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {QueryParamsType} from "../types/query-params.type";
import {QuizListType} from "../types/quiz-list.type";
import {TestResultType} from "../types/test-result.type";
import {UserInfoType} from "../types/user-info.type";
import {DefaultResponseType} from "../types/default-response.type";

export class Choice {
    private quizzes: QuizListType[] = [];
    private testResult: TestResultType[] | null = null;
    private routeParams: QueryParamsType;

    constructor() {

        this.routeParams = UrlManager.getQueryParams();
        this.init();
    }

    private async init(): Promise<void> {
        try {
            this.quizzes = await CustomHttp.request(config.host + '/tests');
        } catch (error) {
            return console.log(error);
            return;
        }
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (userInfo) {
            try {
                const result: DefaultResponseType | TestResultType[] = await CustomHttp.request(config.host + '/tests/results?userId=' + userInfo.userId);
                if (result) {
                    if ((result as DefaultResponseType).error !== undefined) {
                        throw new Error((result as DefaultResponseType).message);
                    }

                    this.testResult = result as TestResultType[];
                }
            } catch (error) {
                return console.log(error);
                return;
            }
        }

        this.processQuizzes();
    }

    private processQuizzes(): void {
        const choiceGroupElement: HTMLElement | null = document.getElementById('choice-group');
        if (this.quizzes && this.quizzes.length > 0 && choiceGroupElement) {
            this.quizzes.forEach((quiz: QuizListType) => {
                const that: Choice = this;
                const choiceOptionElement: HTMLElement | null = document.createElement('div');
                choiceOptionElement.className = 'choice__option';
                choiceOptionElement.setAttribute('data-id', quiz.id.toString());
                choiceOptionElement.onclick = function () {
                    that.chooseQuiz(<HTMLElement>this);
                }

                const choiceOptionTextElement: HTMLElement | null = document.createElement('div');
                choiceOptionTextElement.className = 'choice__option-text';
                choiceOptionTextElement.innerText = quiz.name;

                const choiceOptionArrowElement: HTMLElement | null = document.createElement('div');
                choiceOptionArrowElement.className = 'choice__option-arrow';

                if (this.testResult) {
                    const result: TestResultType | undefined = this.testResult.find(item => item.testId === quiz.id);
                    if (result) {
                        const choiceOptionResultElement: HTMLElement | null = document.createElement('div');
                        choiceOptionResultElement.className = 'choice__option-result';
                        choiceOptionResultElement.innerHTML = '<div>Результат</div><div>' + result.score + '/' + result.total + '</div>';
                        choiceOptionElement.appendChild(choiceOptionResultElement);
                    }
                }

                const choiceOptionImageElement: HTMLElement | null = document.createElement('img');
                choiceOptionImageElement.setAttribute('src', '/images/arrow.png');
                choiceOptionImageElement.setAttribute('alt', 'arrow-right');

                choiceOptionArrowElement.appendChild(choiceOptionImageElement);
                choiceOptionElement.appendChild(choiceOptionTextElement);
                choiceOptionElement.appendChild(choiceOptionArrowElement);

                choiceGroupElement.appendChild(choiceOptionElement);
            });
        }
    }

    private chooseQuiz(element: HTMLElement): void {
        const dataId: string | null = element.getAttribute('data-id')
        if (dataId) {
            location.href = '#/test?id=' + dataId;
        }
    }
}