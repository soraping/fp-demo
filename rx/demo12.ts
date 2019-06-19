import { Subject, interval, merge } from "rxjs";
import { mapTo, take } from "rxjs/operators";

const tick1$ = interval(1000).pipe(
  mapTo("a"),
  take(2)
);
const tick2$ = interval(1000).pipe(
  mapTo("b"),
  take(2)
);

const subject = new Subject();

const merged$ = merge(tick1$, tick2$);

// cold Observable 被 subject 订阅
merged$.subscribe(subject);

// subject 被 observer 订阅
subject.subscribe(value => console.log("observer 1: " + value));
subject.subscribe(value => console.log("observer 2: " + value));
