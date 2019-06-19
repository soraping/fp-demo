import { Observable, of, from } from "rxjs";
import { map } from "rxjs/operators";

const double = () => map(x => x * 2);

of(1, 2, 3)
  .pipe(double())
  .subscribe(console.log);
