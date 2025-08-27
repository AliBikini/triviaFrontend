import { Component } from '@angular/core';
import { TriviaService } from '../../../services/trivia.service';
import { TTriviaQuiz } from '../../../models/trivia.quiz';
import { QuestionComponent } from "../../question/question.component";
import { TTriviaQuizResultDTO } from '../../../dtos/trivia.quiz.result.dto';

@Component({
  selector: 'app-quiz.component',
  imports: [QuestionComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent 
{
  public quiz: TTriviaQuiz | undefined;
  public results: TTriviaQuizResultDTO[] | undefined;
  public numOfAnswersCorrect: number | undefined;
  
  constructor(private triviaService: TriviaService)
  {

  }

  ngOnInit(): void {
    this.triviaService.quizResults$.subscribe((results) => {
      this.results = results;
      this.numOfAnswersCorrect = 0;

      for (let i = 0; i < this.results.length; i++) {
        const result = this.results[i];
        
        if (result.isCorrect)
        {
          this.numOfAnswersCorrect++;
        }
      }
    })

    this.triviaService.quizCurrent$.subscribe((quiz) => {
      this.quiz = quiz;
      this.results = undefined;
      this.numOfAnswersCorrect = undefined;
    })
  }

  public onClickNewQuiz()
  {
    this.triviaService.createQuiz();
  }

  public onClickResult()
  {
    this.triviaService.checkResultCurrentQuiz();
  }
}
