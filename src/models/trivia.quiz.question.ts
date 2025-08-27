export type TTriviaQuizQuestion =
{
    index: number;
    type: string;
    difficulty: string;
    category: string;
    question: string;
    possibleAnswers: string[];
    answerChosen: string;
}