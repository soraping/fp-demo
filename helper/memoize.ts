import * as R from "ramda";

declare global {
  interface Function {
    memoize: (...args) => any;
  }
}

Function.prototype.memoize = function() {
  let fn = this;
  let _cache = {};
  return function() {
    // 缓存键值
    let key = JSON.stringify(arguments);
    if (_cache[key]) {
      console.log("from cache");
    } else {
      console.log("create new");
      _cache[key] = fn.apply(this, arguments);
    }
    return _cache[key];
  };
};

// export const memoize = (fn: Function) => {
//   let _cache = {};
//   return (...args) => {
//     let key = JSON.stringify(args);
//     if (R.has(key)(_cache)) {
//       console.log("from cache");
//       return _cache[key];
//     } else {
//       console.log("create new");
//       let result = fn.apply(this, args);
//       _cache[key] = result;
//       return result;
//     }
//   };
// };

// const add = (a, b) => {
//   return a + b;
// };

// const addMemoize = add.memoize();

// addMemoize(1, 2);
// addMemoize(1, 2);
// addMemoize(1, 2);
