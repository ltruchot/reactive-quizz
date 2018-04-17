import { IQuizzData } from '@models/quizz.model';
import { Subject } from 'rxjs/Subject';

export const quizzData: IQuizzData = {
  // values
  config: {
    speed: 1000,
    language: 'fr',
    itemsNbr: 4
  },
  // subjects
  quizzSubject$: new Subject(),
  itemSubject$: new Subject(),
  answersSubject$: new Subject()
};
