import { domService } from '@app/core/services/dom.service';
import {
  IQuizzComponent,
  IQuizz,
  IQuizzItem,
  IQuizzConfig,
  IQuizzDom
} from '@models/quizz.model';

// create dom containers for quizz
const body: HTMLBodyElement = document.body as HTMLBodyElement;
const container: HTMLDivElement = domService.createContainer();
const title: HTMLHeadingElement = domService.createTitle('Choose a Quizz...');
const rowTitle: HTMLDivElement = domService.createRow();

export const quizzDom: IQuizzDom = {
  rowQ: domService.createRow(),
  rowA: domService.createRow(),
  nav: domService.createNav(),
  choiceBtns: []
};

export const quizzComponent: IQuizzComponent = {
  create() {
    container.appendChild(quizzDom.nav);
    rowTitle.appendChild(title);
    container.appendChild(rowTitle);
    container.appendChild(quizzDom.rowQ);
    container.appendChild(quizzDom.rowA);
    body.appendChild(container);
  },
  toggleBtns(btn: HTMLButtonElement, isExact: boolean) {
    quizzDom.choiceBtns.forEach(
      (btn: HTMLButtonElement) => (btn.disabled = true)
    );
    btn.classList.add(isExact ? 'btn-success' : 'btn-danger');
  },
  fillQuizz(quizz: IQuizz) {
    title.innerText = 'Current quizz: ' + quizz.name['fr'];
  },
  fillAnswers(items: IQuizzItem[]) {
    // clean previous answer buttons
    domService.emptyBlock(quizzDom.rowA);
    items.forEach(item => {
      const btnAnswer = domService.createButton(item.a['fr'], {
        id: item.id + ''
      });
      quizzDom.choiceBtns.push(btnAnswer);
      quizzDom.rowA.appendChild(btnAnswer);
    });
  },
  fillItem(item: IQuizzItem) {
    quizzDom.rowQ.innerText = item.q['fr'];
  },
  createNavButtons([quizzes, config]: [IQuizz[], IQuizzConfig]) {
    quizzes.forEach(quizz => {
      if (quizz.items.length >= config.itemsNbr) {
        quizzDom.nav.appendChild(
          domService.createLink(
            quizz.name['fr'],
            { id: quizz.id + '' },
            { href: '/' + quizz.id }
          )
        );
      }
    });
  }
};
