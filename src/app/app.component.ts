import {Component, ViewContainerRef, ComponentFactoryResolver, ViewChild, Injector, SimpleChange} from '@angular/core';

import {QuizService} from './services/quiz.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('quizContainer', {read: ViewContainerRef}) quizContainer: ViewContainerRef;
  quizStarted = false;

  constructor(private vcr: ViewContainerRef, /*Создает контейнер, наподобие div, где будет располагаться компонент*/
              private cfr: ComponentFactoryResolver,/*Генерирует компонент из кода*/
              private injector: Injector,
              private quizService: QuizService
  ) {
  }

  async startQuiz() {
    await this.lazyLoadQuizCard();
    this.quizStarted = true;
  }

  async showNewQuestion() {
    await this.lazyLoadQuizCard();
  }

  async lazyLoadQuizCard() {
    const {QuizCardComponent} = await import('./components/quiz-card/quiz-card.component');
    const quizCardFactory = this.cfr.resolveComponentFactory(QuizCardComponent);
    const {instance} = this.quizContainer.createComponent(quizCardFactory, null, this.injector);
    instance.question = this.quizService.getNextQuestion();

    instance.questionAnswered.pipe(
      takeUntil(instance.destroy$)
    ).subscribe(() => this.showNewQuestion());

    (instance as any).ngOnChanges({
      question: new SimpleChange(null, instance.question, true)
    });
  }
}
