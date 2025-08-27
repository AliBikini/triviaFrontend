import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { TTriviaQuizQuestion } from '../../models/trivia.quiz.question';
import { TriviaService } from '../../services/trivia.service';

@Component({
  selector: 'app-question',
  imports: [],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css'
})
export class QuestionComponent implements OnInit {
  @Input() public question: TTriviaQuizQuestion | undefined;
  public isCorrect: boolean | undefined = undefined;

  constructor(private triviaService: TriviaService)
  {}

  ngOnInit(): void 
  {
    this.question!.answerChosen = "NONE";

    this.triviaService.quizResults$.subscribe((results) => {
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.index == this.question?.index)
        {
          this.isCorrect = result.isCorrect;
        }
      }
    })
  }

  onChooseAnswer(answer: string) : void
  {
    this.question!.answerChosen = answer;
  }
}
