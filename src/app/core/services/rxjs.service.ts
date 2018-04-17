import { fromEvent } from 'rxjs/observable/fromEvent';
import { filter } from 'rxjs/operators/filter';
import { Observable } from 'rxjs/Observable';

export const rxjsService = {
  delegate(el: HTMLElement, event: string, elClass: string): Observable<any> {
    return fromEvent(el, event).pipe(
      filter((event: MouseEvent) =>
        (event.target as HTMLElement).classList.contains(elClass)
      )
    );
  }
};
// function delegate(wrapper, selector, eventName) {
//   return fromEvent(
//     document.querySelector(wrapper),
//     eventName,
//     e => ({ event: e, delegate: e.target.closest(selector) })
//   ).filter(x => x.delegate !== null);
// }
