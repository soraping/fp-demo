import { asapScheduler, range, asyncScheduler } from "rxjs";
import { observeOn } from "rxjs/operators";

const source$ = range(1, 3);

source$.pipe(observeOn(asyncScheduler)).subscribe(console.log);
