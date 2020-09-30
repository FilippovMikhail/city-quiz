import {
  Component,
  Input,
  NgModule,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {Subject} from 'rxjs';

import {Question} from '../../services/quiz.service';

@Component({
  selector: 'app-quiz-card',
  templateUrl: './quiz-card.component.html',
  styleUrls: ['./quiz-card.component.scss']
})
export class QuizCardComponent implements OnDestroy {

  /*Вопрос*/
  @Input() question: Question;
  /*Ответ на вопрос*/
  @Output() questionAnswered = new EventEmitter<boolean>();
  /*Флаг правильного ответа*/
  answeredCorrectly: boolean;
  destroy$ = new Subject();

  /*Ответ на вопрос*/
  answer(selectedAnswer: string) {
    this.answeredCorrectly = selectedAnswer === this.question.correctAnswer;
    this.questionAnswered.next(this.answeredCorrectly);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

@NgModule({
  declarations: [
    QuizCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ]
})
class QuizCardModule {

}
