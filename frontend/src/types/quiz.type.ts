export type QuizType = {
    id: number,
    name: string,
    questions: Array<QuizQuestionType>
}

export type QuizQuestionType = { 
    id: number,
    question: string,
    answers: Array<QuizAnswerType> 
}

export type QuizAnswerType = {
    correct: any
    id: number,
     answer: string
}