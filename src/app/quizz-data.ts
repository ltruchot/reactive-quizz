import { IQuizzData } from '@models/quizz.model';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IQuizzConfig } from '@models/quizz.model';

export const quizzData: IQuizzData = {
  configSubject$: new BehaviorSubject<IQuizzConfig>({
    speed: 1000,
    language: 'fr',
    itemsNbr: 4
  }),
  quizzSubject$: new Subject(),
  itemSubject$: new Subject(),
  answersSubject$: new Subject(),
  leftItemsSubject$: new Subject(),
  playerScoreSubject$: new Subject()
};
