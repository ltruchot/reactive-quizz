import { Observable } from 'rxjs/Observable';

export interface IQuizz {
  config: IQuizzConfig;
  ticks$: Observable<any>;
  launch: () => void;
}

interface IQuizzConfig {
  speed: number;
}
