import * as R from "ramda";
import { findStudent } from "../helper";

const getFromCache = (cache, key) => cache[key];

const putCache = (cache, key, result) => {
  cache[key] = result;
};

const cacheFn = (cache, fn: Function, ...args) => {
  let key = fn.name + JSON.stringify(args);
  let hasKey = R.has(key);
  if (hasKey(cache)) {
    console.log("from cache");
    return getFromCache(cache, key);
  } else {
    console.log("create new");
    let result = fn.apply(this, args);
    putCache(cache, key, result);
    return result;
  }
};

let cache = {};

cacheFn(cache, findStudent, "4444-444-44");
cacheFn(cache, findStudent, "4444-444-44");
