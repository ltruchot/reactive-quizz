// npm
import { interval } from 'rxjs/observable/interval';
import { map, combineLatest, tap, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
// services
import { apiService } from '@app/core/services/api.service';
import { domService } from '@app/core/services/dom.service';
// models
import { IQuizzGame, IQuizz, IQuizzItem } from '@models/quizz.model';
import { randomService } from '@app/core/services/random.service';

// create dom containers for quizz
const body: HTMLBodyElement = document.body as HTMLBodyElement;
const container: HTMLDivElement = domService.createContainer();
const title: HTMLHeadingElement = domService.createTitle('Choose a Quizz...');
const rowTitle: HTMLDivElement = domService.createRow();
const rowQ: HTMLDivElement = domService.createRow();
const rowA: HTMLDivElement = domService.createRow();
const nav: HTMLElement = domService.createNav();
container.appendChild(nav);
rowTitle.appendChild(title);
container.appendChild(rowTitle);
container.appendChild(rowQ);
container.appendChild(rowA);
body.appendChild(container);

// full quizz game object
const quizzGame: IQuizzGame = {
  // values
  config: {
    speed: 1000,
    qLang: 'fr',
    aLang: 'fr',
    itemsNbr: 4
  },
  currentItem: null,

  // observables
  currentQuizzId$: fromEvent(nav, 'click').pipe(
    map((event: MouseEvent) => {
      event.preventDefault();
      return (event.target as HTMLLinkElement).dataset.id;
    }), // return only id of clicked quizz name
    distinctUntilChanged() // continue only id it is different from previous
  ),
  choice$: fromEvent(rowA, 'click').pipe(
    map((event: MouseEvent) => +(event.target as HTMLButtonElement).dataset.id)
  ),
  ticks$: null,

  // methods
  launch() {
    this.choice$.subscribe((id: number) => {
      if (this.currentItem.id === id) {
        console.log('bravo');
      } else {
        console.log('hell no !');
      }
    });
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
      .subscribe(); // auto subscribe
    this.ticks = interval(this.config.speed);
    //this.nextItem(this.currentQuizz[0]);
  },
  createNavButtons(quizzes: IQuizz[]) {
    quizzes.forEach(quizz => {
      if (quizz.items.length >= this.config.itemsNbr) {
        nav.appendChild(
          domService.createLink(
            quizz.name.en,
            { id: quizz.id + '' },
            { href: '/' + quizz.id }
          )
        );
      }
    });
  },
  fillQuizz(quizz: IQuizz) {
    title.innerText = 'Current quizz: ' + quizz.name.en;
    const quizzItems: IQuizzItem[] = quizz.items;
    const defaultLang = quizz.defaultLang;
    this.currentItem = randomService.getRandomInArray(quizzItems);
    rowQ.innerText =
      this.currentItem.q[this.config.qLang] || this.currentItem.q[defaultLang];
    // clean previous answer buttons
    while (rowA.firstChild) {
      rowA.removeChild(rowA.firstChild);
    }
    // create new answer buttons
    this.currentAnswer =
      this.currentItem.a[this.config.aLang] || this.currentItem.a[defaultLang];
    for (let i = 0; i < 4; i++) {
      const btnAnswer = domService.createButton(
        quizzItems[i].a[this.config.aLang] || quizzItems[i].a[defaultLang],
        {
          id: quizzItems[i].id + ''
        }
      );
      rowA.appendChild(btnAnswer);
    }
  }
};

// run game
quizzGame.launch();
