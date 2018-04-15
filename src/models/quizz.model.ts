import { Observable } from 'rxjs/Observable';

export interface IQuizzGame {
  config: IQuizzConfig;
  currentItem: IQuizzItem;
  // observables
  currentQuizzId$: Observable<any>;
  choice$: Observable<number>;
  ticks$: Observable<number>;
  launch: () => void;
  createNavButtons: (quizzes: IQuizz[]) => void;
  fillQuizz: (quizz: IQuizz) => void;
}

interface IQuizzConfig {
  speed: number;
  qLang: IAvailableLangs;
  aLang: IAvailableLangs;
  itemsNbr: number;
}

export interface IQuizz {
  id: number;
  name: ILangItem;
  reversible: boolean;
  languages: IAvailableLangs[];
  defaultLang: IAvailableLangs;
  items: IQuizzItem[];
}

export interface IQuizzItem {
  id: number;
  reversible: boolean;
  defaultLang: IAvailableLangs;
  q: ILangItem;
  a: ILangItem;
}
interface ILangItem {
  fr?: string;
  en?: string;
  [s: string]: string;
}
type IAvailableLangs = 'fr' | 'en';
