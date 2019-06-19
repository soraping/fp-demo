import { interval } from "rxjs";
import { map, take } from "rxjs/operators";

interval(1000)
  .pipe(
    map(val => `v1 ${val}`),
    take(3)
  )
  .subscribe({
    next: data => console.log(data),
    error: err => console.log(err),
    complete: () => console.log("end")
  });
