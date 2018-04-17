import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export interface IQuizzComponent {
  rowQ: HTMLDivElement;
  rowA: HTMLDivElement;
  nav: HTMLElement;
  choiceBtns: HTMLButtonElement[];
  create: () => void;
  toggleBtns: (btn: HTMLButtonElement, isExact: boolean) => void;
  createNavButtons: (quizzes: IQuizz[]) => void;
  fillQuizz: (quizz: IQuizz) => void;
  fillAnswers: (items: IQuizzItem[]) => void;
  fillItem: (item: IQuizzItem) => void;
}

export interface IQuizzData {
  // values
  config: IQuizzConfig;
  // subjects
  quizzSubject$: Subject<IQuizz>;
  itemSubject$: Subject<IQuizzItem>;
  answersSubject$: Subject<IQuizzItem[]>;
}

export interface IQuizzGame {
  // observables
  currentQuizzId$: Observable<any>;
  clickedChoice$: Observable<any>;
  ticks$: Observable<number>;
  // methods
  launch: () => void;
  nextQuestion: (items: IQuizzItem[]) => void;
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
  items: IQuizzItem[];
}

export interface IQuizzItem {
  id: number;
  reversible: boolean;
  q: ILangItem;
  a: ILangItem;
}
interface ILangItem {
  fr?: string;
  en?: string;
}
type IAvailableLangs = 'fr' | 'en';
