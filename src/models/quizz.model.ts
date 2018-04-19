import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface IQuizzDom {
  body: HTMLBodyElement;
  container: HTMLDivElement;
  rowTitle: HTMLDivElement;
  title: HTMLHeadingElement;
  rowQ: HTMLDivElement;
  rowA: HTMLDivElement;
  nav: HTMLElement;
  score: HTMLDivElement;
  choiceBtns: HTMLButtonElement[];
}

interface IScoreInfos {
  currentScore: number;
  questionsNbr: number;
}
export interface IQuizzComponent {
  create: () => void;
  toggleBtns: (btn: HTMLButtonElement, isExact: boolean) => void;
  refreshScore: ({ currentScore, questionsNbr }: IScoreInfos) => void;
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
  leftItemsSubject$: Subject<IQuizzItem[]>;
  playerScoreSubject$: Subject<number>;
}
export interface INextQuestionInfos {
  leftItems: IQuizzItem[];
  allItems: IQuizzItem[];
  config: IQuizzConfig;
}
export interface IQuizzGame {
  nextQuestion: ({ leftItems, allItems, config }: INextQuestionInfos) => void;
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
