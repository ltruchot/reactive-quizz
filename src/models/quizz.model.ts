import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface IQuizzDom {
  rowQ: HTMLDivElement;
  rowA: HTMLDivElement;
  nav: HTMLElement;
  choiceBtns: HTMLButtonElement[];
}
export interface IQuizzComponent {
  create: () => void;
  toggleBtns: (btn: HTMLButtonElement, isExact: boolean) => void;
  createNavButtons: ([quizzes, config]: [IQuizz[], IQuizzConfig]) => void;
  fillQuizz: (quizz: IQuizz) => void;
  fillAnswers: (items: IQuizzItem[]) => void;
  fillItem: (item: IQuizzItem) => void;
}

export interface IQuizzData {
  // subjects
  configSubject$: BehaviorSubject<IQuizzConfig>;
  quizzSubject$: Subject<IQuizz>;
  itemSubject$: Subject<IQuizzItem>;
  answersSubject$: Subject<IQuizzItem[]>;
}
export interface IQuizzGame {
  nextQuestion: (
    { items, config }: { items: IQuizzItem[]; config: IQuizzConfig }
  ) => void;
}
export interface IQuizzController {
  // observables
  clickedQuizz$: Observable<any>;
  clickedItem$: Observable<any>;
  // methods
  launch: () => void;
}

export interface IQuizzConfig {
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
