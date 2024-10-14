import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../services/auth.js";
import { QueryParamsType } from "../types/query-params.type.js";
import { UserInfoType } from "../types/user-info.type.js";
import { QuizType } from "../types/quiz.type.js";
import { DefaultResponseType } from "../types/default-response.type.js";
import { PassTestResponseType } from "../types/pass-test-response.type.js";

export class Answers {

    private routeParams: QueryParamsType;
    private testId: string;
    private userInfo: UserInfoType | null;
    private quiz: QuizType | null;
    private quizTitleElement: HTMLElement | null;
    private optionsElement: HTMLElement | null;


    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.testId = this.routeParams.id;
        this.userInfo = Auth.getUserInfo();
        this.quiz = null;
        this.init();
        this.quizTitleElement = document.getElementById('test-number');
        this.optionsElement = document.querySelector('.answers__content');

    }

    private async init(): Promise<void> {
        const preTitle: HTMLElement | null = document.getElementById('pre-title');
        if (preTitle) {
        preTitle.innerHTML = `<div id="pre-title">Тест выполнил <span>${(this.userInfo as UserInfoType).fullName}, ${(this.userInfo as any).email}</span></div>`;
        }

        if (this.testId) {
            const backResult = document.getElementById('back-result');
            if (backResult) {
                backResult.addEventListener('click', () => {
                    location.href = '#/result?id=' + this.testId;
                });
            }
            

            try {
                if (this.userInfo) {
                    const result: DefaultResponseType | PassTestResponseType | any = await CustomHttp.request(config.host +
                        '/tests/' + this.testId + '/result/details?userId=' + this.userInfo.userId);
                   if (result) {
                       if ((result as DefaultResponseType).error !== undefined) {
                           throw new Error((result as DefaultResponseType).message);
                       }
                       if (this.quiz) {
                           this.quiz = result.test;
                           this.showRightAnswers();
                       }
                   }
                }
                
            } catch (error) {
                console.log(error);
            }
        }
    }

    private showRightAnswers():void {
        
        if (this.quizTitleElement && this.quiz) {
            this.quizTitleElement.innerHTML = this.quiz.name;
        }
        if (this.quiz) {
            this.quiz.questions.forEach((question, index) => {
                const questionTitleElement: HTMLElement | null = document.createElement('div');
                questionTitleElement.className = 'answers__main-title';
                questionTitleElement.innerHTML = '<span>Вопрос ' + (index + 1) + ':</span> ' + question.question;
    
                const answersElement: HTMLElement | null = document.createElement('div');
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
                    inputElement.setAttribute('value', answer.id.toString());
    
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

                if (this.optionsElement) {
                this.optionsElement.appendChild(questionTitleElement);
                this.optionsElement.appendChild(answersElement);
                }
                
            });
        }

        
    }
}
