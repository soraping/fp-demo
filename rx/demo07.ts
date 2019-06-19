import { of } from "rxjs";
import { repeatWhen } from "rxjs/operators";

const notifier = notification$ => notification$.delay(6000);

const source$ = of(1, 2, 3);

source$.pipe(repeatWhen(notifier)).subscribe(console.log);
