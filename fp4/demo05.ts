import * as R from "ramda";
import { Wrapper } from "./wrap2";

const str = Wrapper.of<string>("hello world")
  .map(R.toUpper)
  .map(R.identity);

// Wrapper { value: 'HELLO WORLD' }
console.log(str);

// Wrapper { value: 'Get Functional' }
console.log(Wrapper.of(Wrapper.of(Wrapper.of("Get Functional"))).join());
