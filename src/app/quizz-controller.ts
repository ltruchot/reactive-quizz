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
  IQuizzGame,
  INextQuestionInfos
} from '@models/quizz.model';
// values
import { quizzData } from '@app/quizz-data';
import { quizzComponent, quizzDom } from '@app/quizz-component';

const quizzGame: IQuizzGame = {
  // methods
  nextQuestion({ leftItems, allItems, config }) {
    // append only if still question left, else, end of current quizz
    if (leftItems.length) {
      // select a random right answer
      const rightAnswer = randomService.getRandomInArray(leftItems);

      // exclude right answer from possible wrong answers & get n wrong answer
      allItems = [...allItems.filter(item => item !== rightAnswer)];
      const wrongAnswers = randomService.getRandomsInArray(
        allItems,
        config.itemsNbr - 1
      );

      // stream those new values
      quizzData.itemSubject$.next(rightAnswer);
      quizzData.answersSubject$.next(wrongAnswers.concat(rightAnswer));

      // stream item lefts for next questions (prevent re-pick same question)
      leftItems = [...leftItems.filter(item => item !== rightAnswer)];
      quizzData.leftItemsSubject$.next(leftItems);
    } else {
      console.log('end game !');
    }
  }
};

// full quizz game object
export const quizzController: IQuizzController = {
  // observables
  clickedQuizz$: rxjsService.delegate(quizzDom.nav, 'click', 'nav-link').pipe(
    // return only id of clicked quizz name
    map((event: MouseEvent) => {
      event.preventDefault();
      return (event.target as HTMLLinkElement).dataset.id;
    }),

    // continue only id it is different from previous
    distinctUntilChanged()
  ),

  clickedItem$: rxjsService.delegate(quizzDom.rowA, 'click', 'btn').pipe(
    // get lastest rightAnwser value
    withLatestFrom(quizzData.itemSubject$, quizzData.playerScoreSubject$),
    map(([event, item, score]: [MouseEvent, IQuizzItem, number]) => {
      const btn = event.target as HTMLButtonElement;
      const id = +btn.dataset.id;
      const rightAnswered = id === item.id;
      quizzComponent.toggleBtns(btn, rightAnswered);
      // stream new player score
      if (rightAnswered) {
        quizzData.playerScoreSubject$.next(++score);
      }
      return item;
    }),
    delay(1000),
    withLatestFrom(
      quizzData.leftItemsSubject$,
      quizzData.quizzSubject$,
      quizzData.configSubject$,
      (_item, leftItems, quizz, config) =>
        ({
          leftItems,
          allItems: quizz.items,
          config
        } as INextQuestionInfos)
    ),
    tap(quizzGame.nextQuestion)
  ),

  launch() {
    // dom component creation
    quizzComponent.create();

    // subscribe to user click event
    this.clickedItem$.subscribe();

    // subscribe to player score
    quizzData.playerScoreSubject$
      .pipe(
        withLatestFrom(quizzData.quizzSubject$, (currentScore, quizz) => ({
          currentScore,
          questionsNbr: quizz.items.length
        })),
        tap(quizzComponent.refreshScore)
      )
      .subscribe();

    // subscribe to current quizz change
    quizzData.quizzSubject$
      .pipe(
        tap(quizzComponent.fillQuizz),
        withLatestFrom(quizzData.configSubject$, (quizz, config) => {
          quizzData.leftItemsSubject$.next(quizz.items);
          return {
            leftItems: quizz.items,
            allItems: quizz.items,
            config
          } as INextQuestionInfos;
        }),
        tap(quizzGame.nextQuestion)
      )
      .subscribe();

    // subscribe to current item changes
    quizzData.itemSubject$.pipe(tap(quizzComponent.fillItem)).subscribe();

    // subscribe to displayed answers changes
    quizzData.answersSubject$.pipe(tap(quizzComponent.fillAnswers)).subscribe();

    // get every quizzes from db
    apiService
      .get<IQuizz[]>('http://localhost:8080/api/quizzs') // get quizzes from db
      .pipe(
        withLatestFrom(quizzData.configSubject$),
        tap(quizzComponent.createNavButtons.bind(quizzComponent)), // create dom nav menu buttons
        map(([quizzes, _config]: [IQuizz[], IQuizzConfig]) => quizzes),
        combineLatest(this.clickedQuizz$), // new quizz id re-triggered on click
        tap(([quizzes, currentId]: [IQuizz[], string]) => {
          const quizz = quizzes.find(
            quizz => quizz.id === (currentId ? +currentId : 0)
          );
          quizzData.quizzSubject$.next(quizz); // next quizz change action
        }),
        tap(() => quizzData.playerScoreSubject$.next(0))
      )
      .subscribe();
  }
};
