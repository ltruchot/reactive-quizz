// npm
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
import {
  IQuizzController,
  IQuizz,
  IQuizzItem,
  IQuizzConfig,
  IQuizzGame
} from '@models/quizz.model';
// values
import { quizzData } from '@app/quizz-data';
import { quizzComponent } from '@app/quizz-component';

const quizzGame: IQuizzGame = {
  // methods
  nextQuestion({ items, config }) {
    const answers = randomService.getRandomsInArray(items, config.itemsNbr);
    const item = randomService.getRandomInArray(answers);
    quizzData.itemSubject$.next(item);
    quizzData.answersSubject$.next(answers);
  }
};

// full quizz game object
export const quizzController: IQuizzController = {
  // observables
  clickedQuizz$: rxjsService
    .delegate(quizzComponent.nav, 'click', 'nav-link')
    .pipe(
      map((event: MouseEvent) => {
        event.preventDefault();
        return (event.target as HTMLLinkElement).dataset.id;
      }), // return only id of clicked quizz name
      distinctUntilChanged() // continue only id it is different from previous
    ),

  clickedItem$: rxjsService.delegate(quizzComponent.rowA, 'click', 'btn').pipe(
    withLatestFrom(quizzData.itemSubject$), // get lastest
    map(([event, item]: [MouseEvent, IQuizzItem]) => {
      const btn = event.target as HTMLButtonElement;
      const id = +btn.dataset.id;
      quizzComponent.toggleBtns(btn, id === item.id);
      return item;
    }),
    delay(1000),
    withLatestFrom(
      quizzData.quizzSubject$,
      quizzData.configSubject$,
      (_item, quizz, config) => ({ items: quizz.items, config })
    ),
    tap(quizzGame.nextQuestion)
  ),

  launch() {
    quizzComponent.create();
    // subscribe to user click event
    this.clickedItem$.subscribe();

    // subscribe to current quizz change
    quizzData.quizzSubject$
      .pipe(
        tap(quizzComponent.fillQuizz),
        withLatestFrom(quizzData.configSubject$, (quizz, config) => ({
          items: quizz.items,
          config
        })),
        tap(quizzGame.nextQuestion)
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
        withLatestFrom(quizzData.configSubject$),
        tap(quizzComponent.createNavButtons.bind(quizzComponent)), // create dom nav menu buttons
        map(([quizzes, _config]: [IQuizz[], IQuizzConfig]) => quizzes),
        combineLatest(this.clickedQuizz$), // new quizz id re-triggering
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
