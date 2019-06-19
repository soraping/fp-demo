import { of, throwError } from "rxjs";
import { map, catchError, finalize } from "rxjs/operators";

of(1, 2, 3, 4)
  .pipe(
    map(x => {
      if (x > 3) {
        throw new Error("value is not 3");
      } else {
        return x;
      }
    }),
    catchError(err => throwError(err)),
    finalize(() => console.log("finally"))
  )
  .subscribe(
    console.log,
    err => console.log(err),
    () => console.log("compelete")
  );
