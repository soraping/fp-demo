import { fromEvent } from "rxjs";
import * as EventEmitter from "events";

const emitter = new EventEmitter();

const source$ = fromEvent(emitter, "msg");

source$.subscribe(
  console.log,
  error => console.log("catch", error),
  () => console.log("complete")
);

emitter.emit("msg", 1);
emitter.emit("msg", 2);
emitter.emit("haha", "hahaha");
emitter.emit("msg", 3);
