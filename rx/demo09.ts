import { of } from "rxjs";
import { catchError, map, take } from "rxjs/operators";

of(1, 2, 3, 4)
  .pipe(
    map(x => {
      if (x > 3) {
        throw new Error("value is must <= 3");
      } else {
        return x;
      }
    }),
    catchError((err, caught$) => caught$),
    take(9)
  )
  .subscribe(
    console.log,
    err => console.log(err),
    () => console.log("complete")
  );
