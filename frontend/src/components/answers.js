import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../services/auth.js";

export class Answers {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.testId = this.routeParams.id;
        this.userInfo = Auth.getUserInfo();
        this.quiz = null;
        this.init();
    }

    async init() {
        document.getElementById('pre-title').innerHTML = `<div id="pre-title">Тест выполнил <span>${this.userInfo.fullName}, ${this.userInfo.email}</span></div>`;

        if (this.testId) {
            document.getElementById('back-result').addEventListener('click', () => {
                location.href = '#/result?id=' + this.testId;
            });

            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.testId + '/result/details?userId=' + this.userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    this.quiz = result.test;
                    this.showRightAnswers();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    showRightAnswers(){
        this.quizTitleElement = document.getElementById('test-number');
        this.quizTitleElement.innerHTML = this.quiz.name;
        this.optionsElement = document.querySelector('.answers__content');

        this.quiz.questions.forEach((question, index) => {
            const questionTitleElement = document.createElement('div');
            questionTitleElement.className = 'answers__main-title';
            questionTitleElement.innerHTML = '<span>Вопрос ' + (index + 1) + ':</span> ' + question.question;

            const answersElement = document.createElement('div');
            answersElement.className = 'answers__question-options';

            question.answers.forEach((answer, aIndex) => {
                const varElement = document.createElement('div');
                varElement.className = 'answers__question-option';
                const inputId = 'answer-' + answer.id;
                const inputElement = document.createElement('input');
                inputElement.className = 'var-answer';
                inputElement.setAttribute('id', inputId);
                inputElement.setAttribute('type', 'radio');
                inputElement.setAttribute('name', 'answer-' + index);
                inputElement.setAttribute('value', answer.id);

                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', inputId);
                labelElement.innerText = answer.answer;

                if (answer.hasOwnProperty('correct')) {
                    inputElement.checked = true;
                    if (answer.correct) {
                        varElement.classList.add('right-answer');
                    } else {
                        varElement.classList.add('wrong-answer');
                    }
                }

                varElement.appendChild(inputElement);
                varElement.appendChild(labelElement);
                answersElement.appendChild(varElement);
            });

            this.optionsElement.appendChild(questionTitleElement);
            this.optionsElement.appendChild(answersElement);
        });
    }
}
