import { Observable, Observer } from "rxjs";
import { map, filter } from "rxjs/operators";

const onSbuscribe = (observer: Observer<any>) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
};

const source$ = new Observable(onSbuscribe);

source$
  .pipe(
    map(x => x * x),
    filter(x => x > 3)
  )
  .subscribe(console.log);
