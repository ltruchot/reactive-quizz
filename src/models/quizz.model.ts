import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export interface IQuizzComponent {
  rowQ: HTMLDivElement;
  rowA: HTMLDivElement;
  displayItem: (item: IQuizzItem) => void;
  toggleBtn: (btn: HTMLButtonElement, isExact: boolean) => void;
}

export interface IQuizzData {
  // values
  config: IQuizzConfig;
  // subjects
  currentItemSubject$: Subject<IQuizzItem>;
}

export interface IQuizzGame {
  // observables
  currentQuizzId$: Observable<any>;
  clickedChoice$: Observable<any>;
  ticks$: Observable<number>;
  // methods
  launch: () => void;
  createNavButtons: (quizzes: IQuizz[]) => void;
  fillQuizz: (quizz: IQuizz) => void;
}

interface IQuizzConfig {
  speed: number;
  language: IAvailableLangs;
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
