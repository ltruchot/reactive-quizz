import { Observable } from 'rxjs/Observable';
export const apiService = {
  get(url: string) {
    return Observable.create((observer: any) => {
      const req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = () => {
        if (req.status === 200) {
          observer.next(req.response);
          observer.complete();
        } else {
          observer.error(new Error(req.statusText));
        }
      };
      req.onerror = () => {
        observer.error(new Error('An error occured'));
      };
      req.send();
    });
  }
};
