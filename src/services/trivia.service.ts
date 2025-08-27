import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, map } from "rxjs";
import { TTriviaQuiz } from "../models/trivia.quiz";
import axios, { AxiosResponse } from "axios";
import { TTriviaQuizResultDTO } from "../dtos/trivia.quiz.result.dto";

@Injectable({ providedIn: 'root' })
export class TriviaService
{
    private quizCurrent: TTriviaQuiz | undefined;
    private quizCurrentSubject: Subject<TTriviaQuiz | undefined> = new Subject<TTriviaQuiz | undefined>();
    public quizCurrent$: Observable<TTriviaQuiz | undefined> = this.quizCurrentSubject.asObservable();

    private quizResultsSubject: Subject<TTriviaQuizResultDTO[]> = new Subject<TTriviaQuizResultDTO[]>();
    public quizResults$: Observable<TTriviaQuizResultDTO[]> = this.quizResultsSubject.asObservable();

    url = 'http://localhost:8080';

    constructor() 
    {}

    public async createQuiz(options?: any): Promise<TTriviaQuiz> 
    {
        this.quizCurrent = undefined;
        this.quizCurrentSubject.next(this.quizCurrent);

        const result: AxiosResponse = await axios.get(this.url + "/questions", {
            headers: {
              "Content-Type": "application/json"
            },
          });
        
        this.quizCurrent = result.data as TTriviaQuiz;
        this.quizCurrentSubject.next(this.quizCurrent);
        return this.quizCurrent;
    }

    private async getResultCurrentQuiz(options?: any): Promise<TTriviaQuizResultDTO[] | undefined> 
    {
        if (!this.quizCurrent)
        {
          return undefined;
        }

        const answersChosen: string[] = [];

        for (let i = 0; i < this.quizCurrent.questions.length; i++) {
          const question = this.quizCurrent.questions[i];
          let answerChosen: string | "NONE" = question.answerChosen;
          answersChosen.push(answerChosen);
        }

        const result: AxiosResponse = await axios.post(this.url + "/checkanswers/" + this.quizCurrent?.idQuiz, answersChosen);
        return result.data.results as TTriviaQuizResultDTO[];
    }

    public async checkResultCurrentQuiz()
    {
      const results: TTriviaQuizResultDTO[] | undefined = await this.getResultCurrentQuiz();

      if (results)
      {
        console.log("resultsCheck:");
        console.log(results);
        this.quizResultsSubject.next(results);
      }
    }
}