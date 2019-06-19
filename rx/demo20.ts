import { combineLatest, of } from "rxjs";

const source1$ = of("a", "b", "c");
const source2$ = of(1, 2, 3);

combineLatest(source1$, source2$, (a, b) => `${a} and ${b}`).subscribe(
  console.log,
  null,
  () => console.log("complete")
);
