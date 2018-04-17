import { IQuizzItem } from '@models/quizz.model';

export const randomService = {
  getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  },
  getRandomInArray(items: any[]): IQuizzItem {
    const randomIndex = this.getRandomInt(items.length);
    return items[randomIndex];
  },
  getRandomsInArray(items: any[], count: number): any[] {
    const arr: any[] = items.slice();
    let randoms: any[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = this.getRandomInt(arr.length);
      randoms = randoms.concat(arr.splice(randomIndex, 1));
    }
    return randoms;
  }
};
