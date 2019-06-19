import { Subject, interval, Observable } from "rxjs";
import { take } from "rxjs/operators";

/**
 * 自定义操作符
 * 返回一个纯粹的Observable对象，而不是一个Subject对象
 * @return Observable<T>
 */
const makeHot = () => (source$: Observable<any>) => {
  const subject = new Subject();
  source$.subscribe(subject);
  return new Observable(observer => subject.subscribe(observer));
};

const subject = interval(1000).pipe(
  take(3),
  makeHot()
);

subject.subscribe(value => console.log("observer 1 " + value));

setTimeout(() => {
  subject.subscribe(value => console.log("observer 2 " + value));
}, 1500);
