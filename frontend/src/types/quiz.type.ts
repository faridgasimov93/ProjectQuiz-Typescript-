export type QuizType = {
    id: number,
    name: string,
    questions: Array<{ id: number, question: string, answers: Array<{ id: number, answer: string }> }>
}