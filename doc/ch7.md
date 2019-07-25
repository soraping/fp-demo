函数式编程提供流畅而描述行的抽象层，哪怕用柯里化，递归，`Monadic` 封装和组合来解决最简单的问题。

现代的 `web` 应用程序，除了游戏，减少几个毫秒并不能带来什么价值。计算机已经非常快而且编译器技术也先进得惊人，这保证了代码性能。因此函数式不仅不比命令式性能低，还有别的闪光点。

函数式编程不会加快单个函数的求值速度。相反，它的理念是避免重复的函数调用以及延迟调用代码，把求值延迟到必要的时候，这可能会使应用程序的整体加速。在纯函数式语言中，平台内置了这些优化，所以大多数情况下并不需要开发者关心优化问题。然而在 `javascript` 中，开发者需要通过自定义代码或函数式库来做到这些优化。

### 函数执行机制

`FP` 依赖于函数求值，了解每一个函数调用时发生了什么对于性能和优化函数是很必要的，也必须了解每个函数调用的推移。

**在 `javascript` 中，每个函数调用其实都会在函数上下文堆栈中创建记录（帧）。**

> 栈，是一个基本的数据结构，它的插入和取出顺序是后进先出（LIFO）。可以想象成一个堆叠在一起的碟子：所有操作都只能从最顶部的碟子开始。

`javascript` 编程模型中的上下文堆栈负责管理函数执行以及关闭变量作用域。堆栈始终从全局执行上下文帧开始，其包含所有全局变量。

**`javascript` 执行上下文栈的初始化。取决于页面上要加载多少脚本，全局上下文可能有大量的变量和函数。**

全局上下文帧永远驻留在堆栈的地步。每个函数的上下文帧都占有一定量的内存，实际取决于其中的局部变量的个数。如果没有任何局部变量，一个空帧大约 48 个字节。每个数字或布尔类型的局部变量和参数会占用 8 字节。所以，函数体声明越多的变量，就需要越大的堆栈帧。

- `javascript` 是单线程的，这意味着执行的同步性
- 有且只有一个全局上下文（与所有函数的上下文共享）
- 函数上下文的数量是有限的
- 每个函数调用都会创建一个新的上下文环境，递归调用也是如此

鼓励把问题分解为尽可能多的函数和尽可能的柯里化，以获得更多的灵活性和重用性。

#### 柯里化与函数上下文堆栈

使用柯里化函数会对上下文堆栈产生影响，这种额外的抽象可能会导致大量上下文堆栈的开销。

柯里化函数时，把一次函数执行变成了多次执行的函数（每次消费一个参数）。

```js
const logger = function(appender, layout, name, level, message)
```

柯里化后会变成如下嵌套结构：

```js
const logger = function(appender) {
  return function(layout) {
    return function(name) {
      return function(level) {
        return function(message) {
          // ...
        };
        // ...
      };
    };
  };
};
```

嵌套结构的函数会使用更多的堆栈。

> 非柯里化情况下，执行 `logger` ，单线程 `javascript` 运行时会暂停当前全局上下文并激活新函数创建的上下文。此时，还会通过 `scopeChain` 创建到全局上下文的链接，一旦函数 `logger` 返回，它的执行上下文也会被弹出堆栈，全局上下文将恢复。

当柯里化 `logger` 执行时，函数内部调用了其他函数时，会在堆栈上产生新函数的上下文。由于 `javascript` 的闭包，内部函数调用的上下文在外部函数上下文堆栈的上面占用分配给它的存储器，并经由 `scopeChain` 链接起来。

**运行嵌套函数时，函数上下文的变化。因为每个函数会产生新的堆栈帧，所以堆栈增长跟函数的层级成正比。柯里化与递归都依赖于嵌套的函数调用。**

柯里化所有函数看起来时不错的主意，但是过度使用会导致其占用较大的堆栈空间，进而导致程序运行速度显著降低。

#### 递归的弱点

**函数调用自己也会创建新的函数上下文。**

所以，不正确的递归调用，永远无法满足结束条件，很容易导致堆栈溢出。

```bash
RangeError: Maximum call stack size exceeded or too much recursion
```

不同的浏览器的堆栈错误会有不同，谷歌浏览器会在 `17500` 次递归后触发异常，火狐大约在 `213000` 次。

例如：找出某个数组元素中，字符长度最长的一个

```js
import * as R from "ramda";

/**
 * 通过递归，获取数组中字符最长的一个
 * @param str 当前字符
 * @param arr 目标数组
 */
function longest(str: string, arr: string[]): string {
  if (R.isEmpty(arr)) {
    return str;
  } else {
    let currentStr = R.head(arr).length >= str.length ? R.head(arr) : str;
    return longest(currentStr, R.tail(arr));
  }
}
```

`longest` 函数，为了在大小为 n 的数组中找到最长字符串，需要插入 n 帧到上下文堆栈

如果 n 的值非常大，会创建 n 帧的上下文环境，导致堆栈溢出异常。

遍历这种异常巨大的数组的另一种方式就是利用高阶函数，`map filter reduce` 。使用这些函数不会产生嵌套的函数调用，因为堆栈在每次迭代循环后都能得到回收。

### 使用惰性求值推迟执行

当输入很大但只有一个小的子集有效时，避免不必要的函数调用可以体现出许多性能优势，例如惰性求值，即尽可能地推迟求值，知道依赖的表达式被调用。

但是，`javascript` 使用的是更主流的函数式求值策略--**及早求值**，及早求值会在表达式绑定到变量时求值，不管结果是否会被用到，所以也称为**贪婪求值**。

#### 使用函数式组合子避免重复计算

在最简单的情况下，可以通过只传递函数引用（或名称），然后有条件地选择调用或不调用。

```js
const alt = R.curry((func1, func2, val) => func1(val) || func2(val));

// 没有函数会过早地调用，因为组合子使用地只是它们地函数引用
const showStudent = R.compose(
  append("#sutdent-info"),
  alt(findStudent, createNewStudent)
);

showStudent("444-44-4444");
```

#### 利用 shortcut fusion

在某种情况下，`Lodash` 会使用 `shortcut fusion` 对程序进行优化，这是一种函数级别的优化，它通过合并函数执行，并压缩计算过程中使用的临时数据结构，处理大集合时，创建更少的数据结构能有效地降低内存占用。

函数式编程的引用透明性带啦的数学与代数的正确性。

```js
compose(
  map(f),
  map(g)
);

// 替代表达式
map(
  compose(
    f,
    g
  )
);

compose(
  filter(p1),
  filter(p2)
);

// 替代表达式
filter(x => p1(x) && p2(x));
```

`Lodash` 的惰性求值与和 `shortcut fusion`：

```js
import * as _ from "lodash";
import * as R from "ramda";

const square = x => Math.pow(x, 2);

const isEven = x => x % 2 === 0;

// // 生成一个从0到200数值数组
const numbers = _.range(200);

const log = name => R.tap(() => console.log(`[${name}]`));

const squareR = R.compose(
  log("mapping"),
  square
);

const isEvenR: (p: any) => boolean = R.compose(
  log("then filter"),
  isEven
);

// const result = R.compose(
//   R.take(3),
//   R.filter(isEvenR),
//   R.map(squareR)
// );

// console.log(result(numbers));

const result = _.chain(numbers)
  .map(squareR)
  .filter(isEvenR)
  .take(3)
  .value();

console.log(result);
```

打印结果：

```bash
[mapping]
[then filter]
[mapping]
[then filter]
[mapping]
[then filter]
[mapping]
[then filter]
[mapping]
[then filter]
[ 0, 4, 16 ]
```

看到打印的 `[mapping]` 和 `[then filter]` 只有 5 次，而不是概念中的 200 次。

> `lodash` 的延时计算，在未调用 `.value()` 之前不会执行链式方法，由于执行被延后了，因此 `lodash` 可以进行 `shortcut fusion` 优化，通过合并链式 `iteratee` 大大降低了迭代次数。

### 实现需要时调用的策略

加快应用程序执行的方法之一是避免计算重复值，特别是当这些计算的代价昂贵时。

```js
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
```

控制台打印：

```bash
create new
from cache
```

第一次调用程序走了创建流程，第二次则直接从缓存中读取！

#### 理解记忆化

**记忆化（memoization）** 方案与缓存类似。它就像以前的代码中，基于函数的参数创建与之对应的唯一的键，并将结果值存储到对应的键上，当再次遇到相同参数的函数时，立即返回存储的结果。

#### 记忆化计算密集型函数

纯函数式语言自带记忆化。其他诸如 `javascript` 和 `python` 的语言，可以在需要时选择记忆化函数。当然，计算密集型函数很大程度上可以受益于缓存层。

```js
import * as R from "ramda";

export const memoize = (fn: Function) => {
  let _cache = {};
  return (...args) => {
    let key = JSON.stringify(args);
    if (R.has(key)(_cache)) {
      console.log("from cache");
      return _cache[key];
    } else {
      console.log("create new");
      let result = fn.apply(this, args);
      _cache[key] = result;
      return result;
    }
  };
};

const add = (a, b) => {
  return a + b;
};

const addMemoize = memoize(add);

addMemoize(1, 2);
addMemoize(1, 2);
addMemoize(1, 2);
```

后两次调用都会从缓存中去得数据。

也可以给 `Function` 原型上追加方法:

```js
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
    let key = Array.prototype.join.call(fn, arguments);
    if (_cache[key]) {
      console.log("from cache");
    } else {
      console.log("create new");
      _cache[key] = fn.apply(this, arguments);
    }
    return _cache[key];
  };
};

```

看下实际操作时间：

```js
import * as R from "ramda";
import { IO } from "../monad";
import "../helper/memoize";
import { performance } from "perf_hooks";

const add = (a, b) => {
  let sum = a + b;
  for (let i = 0; i < 100; i++) {
    sum += i;
  }
  return sum;
};

const addMemoize = add.memoize();

const start = () => performance.now();

const end = startTime => {
  let endTime = performance.now();
  return (endTime - startTime).toFixed(3);
};

const test = (fn, ...args) => () => fn(...args);

// 通过tap组合子在monad中生成算法开始时间的信息
// 这样做是因为并不开心函数的结果，而是得出结果所花费的时间
const testAdd = IO.of(start())
  .map(R.tap(test(addMemoize, 1, 2)))
  .map(end);

console.log(testAdd.run());
console.log(testAdd.run());
console.log(testAdd.run());
```

#### 有效利用柯里化与记忆化

柯里化可以将一个多元函数变成一元函数。

```js
import * as R from "ramda";
import "../helper/memoize";

interface IStudent {
  ssn: string;
  name: string;
}

const DB = (property: string) => {
  return [
    {
      name: "zhangsan",
      ssn: "4444-444-44"
    },
    {
      name: "lisi",
      ssn: "5555-555-55"
    }
  ];
};

const find = (db: IStudent[], id: string) => {
  return R.find(R.propEq("ssn", id))(db);
};

const safeFindObject = R.curry(find);

const findStudent = safeFindObject(DB("student")).memoize();

findStudent("4444-444-44");
findStudent("4444-444-44");
findStudent("4444-444-44");
```

#### 通过分解来实现更大程度的记忆化

将任务分解，分解的任务都可以记忆化，通常是给记忆化函数加上前缀 `m_`。

#### 记忆化递归调用

递归可能会导致浏览器卡顿或者抛出异常。这些往往都是由输入过大时堆栈的增加失控导致的。

```js
import "../helper/memoize";

const factorial = n => (n === 0 ? 1 : n * factorial(n - 1));
const m_factorial = factorial.memoize();

console.time("factorial(100)");
console.log(m_factorial(100));
console.timeEnd("factorial(100)");
console.time("factorial(101)");
console.log(m_factorial(101));
console.timeEnd("factorial(101)");
```

控制台展示：

```bash

9.33262154439441e+157
factorial(100): 2.835ms

9.425947759838354e+159
factorial(101): 0.136ms
```

递归是将任务分解成更小版本的自己的机制，每次递归调用都在一个更小的子集解决 “同样的问题”，直至达到递归的基例情况，然后释放堆栈返回结果。如果每一个子任务的结果都能缓存，就可以减少重复同样的计算，从而提高性能。

第一次执行使用了 `1.879ms` ，第二次却只用了 `0.079ms`。

由于记忆化了阶乘函数，在第二次迭代时吞吐有显著的提升。在第二次运行时，函数“记住”了使用公式，并且可以重复使用 `factorial(100)` 的值，使得整个算法立即返回，并对栈帧的管理以及污染堆栈方面都有好处。

运行记忆化的 `factorial(100)` 在第一次会创建 `100` 的堆栈帧，因为它需要计算 `100!` 在第二次调用 `101` 的阶乘时通过记忆化能够重复使用 `factorial(100)` 的结果，所以只会创建 2 个堆栈帧。

### 递归和尾递归优化

递归程序使用堆栈的情况会比非递归程序更严重一些。有些函数式语言甚至没有内置的循环机制，需要依靠递归和缓存来实现高效的迭代。

**有时记忆化也无能为力，比如输入不断变化，就会导致内部高速缓存层一直派不上用场。**

当使用尾递归时，编译器有可能帮助你做 **尾部调用优化（TCO）**。

```js
/**
 * 函数最后一条语句是下一次递归（即处于尾部）
 * @param n
 * @param current
 */
const factorial = (n, current = 1) =>
  n === 1 ? current : factorial(n - 1, n * current);
```

**TCO 称为尾部调用消除**，是 `ES6` 添加的编译器增强功能。同时，在最后的位置调用别的函数也可以优化，该调用位置称为**尾部位置**（尾递归因此而得名）。

**函数的最后一件事情如果是递归的函数调用，那么运行时会认为不必要保持当前的栈帧，因为所有的工作已经完成，完全可以抛弃当前帧。**

在大多数时候，只有将函数的上下文状态作为参数传递给下一个函数调用（正如在递归阶乘函数处看到的），才能使用递归调用不需要依赖当前帧。通过这种方式，递归每次都会创建一个新的帧，回收的帧，而不是将新的帧叠在旧的帧上。

#### 将非尾递归转换成尾递归

非尾递归：

```js
const factorial = n => (n === 1 ? 1 : n * factorial(n - 1));
```

该递归调用并没有发生在尾递归，因为最后返回的表达式是：

```js
n * factorial(n - 1);
```

改成尾递归：

- 将当前乘法结果当作参数传入递归函数；
- 使用 `ES6` 的默认参数给定一个默认值（也可以部分地应用它们，但默认参数会让代码更整洁）。

```js
const factorial = (n, current = 1) =>
  n === 1 ? current : factorial(n - 1, n * current);
```

递归计算数组元素总和：

```js
import * as _ from "lodash";

function sum(arr) {
  if (_.isEmpty(arr)) {
    return 0;
  }
  return _.first(arr) + sum(_.drop(arr));
}

function sumTCO(arr: number[], acc = 0) {
  if (_.isEmpty(arr)) {
    return acc;
  }
  return sumTCO(_.drop(arr), acc + _.first(arr));
}

let arr = [1, 2, 3, 4, 5, 6, 7];

console.time("sum");
console.log(sum(arr));
console.timeEnd("sum");

console.time("sumTCO");
console.log(sumTCO(arr));
console.timeEnd("sumTCO");
```

控制台打印：

```bash
28
sum: 2.665ms
28
sumTCO: 0.151ms
```

**尾递归带来递归循环的性能接近于 `for` 循环。不过尾调用也不仅限于递归，也可以是调用另一个函数。**
