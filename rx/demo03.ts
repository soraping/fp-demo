import { Observable, Observer } from "rxjs";

/**
 * 第一步：创造一个onSbuscribe函数，这个函数会被用作Observable构造函数的参数，
 * 在这个函数参数完全决定了Observable对象的行为。onSbuscribe函数接收一个名为observer参数，
 * 函数体内，调用参数observer的next函数，把数据 推 给Observer
 * @param observer
 */
const onSbuscribe = (observer: Observer<any>) => {
  let number = 1;
  const handle = setInterval(() => {
    observer.next(number++);
    if (number > 3) {
      clearInterval(handle);
      observer.complete();
    }
  }, 1000);
};

/**
 * 第二步：调用Observable构造函数，产生一个名为source$的数据流对象
 */
const source$ = new Observable(onSbuscribe);

/**
 * 第三步：创造观察者theObserver
 */
const theObserver = {
  next: item => console.log(item),
  complete: () => console.log("no more data")
};

/**
 * 第四步：通过subscribe函数将theObserver和source$关联起来
 */
source$.subscribe(theObserver);
