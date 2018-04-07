// npm
import { interval } from 'rxjs/observable/interval';
// services
import { apiService } from '@app/core/services/api.service';
// models
import { IQuizz } from '@models/quizz.model';

const quizz: IQuizz = {
  config: {
    speed: 1000
  },
  ticks$: null,
  launch(): void {
    this.ticks$ = interval(this.config.speed);
  }
};
quizz.launch();

const quizzItems$ = apiService.get('http://localhost:8080/api/items');
quizzItems$.subscribe(
  (response: any) => {
    console.log(response);
    quizz.launch();
    quizz.ticks$.subscribe((tick: number) => {
      console.log(tick);
    });
  },
  (error: any) => console.error(error),
  () => console.log('done')
);
