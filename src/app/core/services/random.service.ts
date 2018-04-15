import { IQuizzItem } from '@models/quizz.model';

export const randomService = {
  getRandomInArray(items: any[]): IQuizzItem {
    return items[Math.floor(Math.random() * items.length)];
  }
};
