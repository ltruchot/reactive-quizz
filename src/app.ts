// npm
import { interval } from 'rxjs/observable/interval';
import {
  map,
  combineLatest,
  tap,
  distinctUntilChanged,
  delay,
  withLatestFrom
} from 'rxjs/operators';

// services
import { apiService } from '@app/core/services/api.service';
import { randomService } from '@app/core/services/random.service';
import { rxjsService } from '@app/core/services/rxjs.service';
// models
import { IQuizzGame, IQuizz, IQuizzItem } from '@models/quizz.model';
// values
import { quizzComponent } from '@app/quizz-component';
import { quizzData } from '@app/quizz-data';

quizzComponent.create();

// full quizz game object
const quizzGame: IQuizzGame = {
  // observables
  currentQuizzId$: rxjsService
    .delegate(quizzComponent.nav, 'click', 'nav-link')
    .pipe(
      map((event: MouseEvent) => {
        event.preventDefault();
        return (event.target as HTMLLinkElement).dataset.id;
      }), // return only id of clicked quizz name
      distinctUntilChanged() // continue only id it is different from previous
    ),

  clickedChoice$: rxjsService
    .delegate(quizzComponent.rowA, 'click', 'btn')
    .pipe(
      withLatestFrom(quizzData.itemSubject$), // get lastest
      map(([event, item]: [MouseEvent, IQuizzItem]) => {
        const btn = event.target as HTMLButtonElement;
        const id = +btn.dataset.id;
        quizzComponent.toggleBtns(btn, id === item.id);
        return item;
      }),
      delay(1000)
    ),
  ticks$: interval(quizzData.config.speed),

  // methods
  nextQuestion(items: IQuizzItem[]) {
    const answers = randomService.getRandomsInArray(
      items,
      quizzData.config.itemsNbr
    );
    const item = randomService.getRandomInArray(answers);
    quizzData.itemSubject$.next(item);
    quizzData.answersSubject$.next(answers);
  },
  launch() {
    // subscribe to user click event
    this.clickedChoice$
      .pipe(
        withLatestFrom(quizzData.quizzSubject$),
        tap(([_item, quizz]: [IQuizzItem, IQuizz]) => {
          this.nextQuestion(quizz.items);
        })
      )
      .subscribe();

    // subscribe to current quizz change
    quizzData.quizzSubject$
      .pipe(
        tap(quizzComponent.fillQuizz),
        map((quizz: IQuizz) => {
          const quizzItems = quizz.items;
          this.nextQuestion(quizz.items);
          return quizzItems;
        })
      )
      .subscribe();

    // subscribe to current item changes
    quizzData.itemSubject$
      .pipe(tap(quizzComponent.fillItem.bind(quizzComponent)))
      .subscribe();

    // subscribe to displayed answers changes
    quizzData.answersSubject$
      .pipe(tap(quizzComponent.fillAnswers.bind(quizzComponent)))
      .subscribe();

    // subscribe to every quizzes from db
    apiService
      .get<IQuizz[]>('http://localhost:8080/api/quizzs') // get quizzes from db
      .pipe(
        tap(quizzComponent.createNavButtons.bind(quizzComponent)), // create dom nav menu buttons
        combineLatest(this.currentQuizzId$), // new quizz id re-triggering
        tap(([quizzes, currentId]: [IQuizz[], string]) => {
          const quizz = quizzes.find(
            quizz => quizz.id === (currentId ? +currentId : 0)
          );
          quizzData.quizzSubject$.next(quizz);
        }) // return the chose quizz
      )
      .subscribe(); // auto
  }
};

// run game
quizzGame.launch();
