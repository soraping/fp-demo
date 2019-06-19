import { asapScheduler, asyncScheduler } from "rxjs";

console.log("before scheduler");
asyncScheduler.schedule(() => console.log("async"));
asapScheduler.schedule(() => console.log("asap"));
console.log("end scheduler");
