// npm
import { interval } from 'rxjs/observable/interval';
import { map, combineLatest, tap, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
// services
import { apiService } from '@app/core/services/api.service';
import { domService } from '@app/core/services/dom.service';
// models
import {
  IQuizzGame,
  IQuizz,
  IQuizzItem,
  IQuizzData,
  IQuizzComponent
} from '@models/quizz.model';
import { randomService } from '@app/core/services/random.service';
import { Subject } from 'rxjs/Subject';

// create dom containers for quizz
const body: HTMLBodyElement = document.body as HTMLBodyElement;
const container: HTMLDivElement = domService.createContainer();
const title: HTMLHeadingElement = domService.createTitle('Choose a Quizz...');
const rowTitle: HTMLDivElement = domService.createRow();
const nav: HTMLElement = domService.createNav();

const quizzComponent: IQuizzComponent = {
  rowQ: domService.createRow(),
  rowA: domService.createRow(),
  displayItem(item: IQuizzItem) {
    quizzComponent.rowQ.innerText = item.q['fr'];
  },
  toggleBtn(btn: HTMLButtonElement, isExact: boolean) {
    btn.classList.add(isExact ? 'btn-success' : 'btn-danger');
  }
};
container.appendChild(nav);
rowTitle.appendChild(title);
container.appendChild(rowTitle);
container.appendChild(quizzComponent.rowQ);
container.appendChild(quizzComponent.rowA);
body.appendChild(container);

const quizzData: IQuizzData = {
  // values
  config: {
    speed: 1000,
    language: 'fr',
    itemsNbr: 4
  },
  // subjects
  currentItemSubject$: new Subject()
};

// full quizz game object
const quizzGame: IQuizzGame = {
  // observables
  currentQuizzId$: fromEvent(nav, 'click').pipe(
    map((event: MouseEvent) => {
      event.preventDefault();
      return (event.target as HTMLLinkElement).dataset.id;
    }), // return only id of clicked quizz name
    distinctUntilChanged() // continue only id it is different from previous
  ),

  clickedChoice$: fromEvent(quizzComponent.rowA, 'click').pipe(
    combineLatest(quizzData.currentItemSubject$),
    tap(([event, item]: [MouseEvent, IQuizzItem]) => {
      const btn = event.target as HTMLButtonElement;
      const id = +btn.dataset.id;
      quizzComponent.toggleBtn(btn, id === item.id);
    })
  ),
  ticks$: interval(quizzData.config.speed),

  // methods
  launch() {
    // subscribe to user click event
    this.clickedChoice$.subscribe();

    // subscribe to current item change
    quizzData.currentItemSubject$
      .pipe(tap(quizzComponent.displayItem))
      .subscribe();

    // subscribe to every quizzes from db
    apiService
      .get<IQuizz[]>('http://localhost:8080/api/quizzs') // get quizzes from db
      .pipe(
        tap(this.createNavButtons.bind(this)), // create dom nav menu buttons
        combineLatest(this.currentQuizzId$), // add latest chosen quizz id to data
        map(([quizzes, currentId]: [IQuizz[], string]) =>
          quizzes.find(quizz => quizz.id === (currentId ? +currentId : 0))
        ), // return the chose quizz
        tap(this.fillQuizz.bind(this))
      )
      .subscribe(); // auto
  },

  createNavButtons(quizzes: IQuizz[]) {
    quizzes.forEach(quizz => {
      if (quizz.items.length >= quizzData.config.itemsNbr) {
        nav.appendChild(
          domService.createLink(
            quizz.name['fr'],
            { id: quizz.id + '' },
            { href: '/' + quizz.id }
          )
        );
      }
    });
  },
  fillQuizz(quizz: IQuizz) {
    const quizzItems: IQuizzItem[] = quizz.items;
    const defaultLang = quizz.defaultLang;

    title.innerText = 'Current quizz: ' + quizz.name['fr'];
    quizzData.currentItemSubject$.next(
      randomService.getRandomInArray(quizzItems)
    );

    // clean previous answer buttons
    domService.emptyBlock(quizzComponent.rowA);

    // create new answer buttons
    for (let i = 0; i < 4; i++) {
      const btnAnswer = domService.createButton(
        quizzItems[i].a[quizzData.config.language] ||
          quizzItems[i].a[defaultLang],
        {
          id: quizzItems[i].id + ''
        }
      );
      quizzComponent.rowA.appendChild(btnAnswer);
    }
  }
};

// run game
quizzGame.launch();
