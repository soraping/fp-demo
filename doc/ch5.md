### 命令式错误处理的不足

> 在许多情况下都会发生 `javascript` 错误，特别是在与服务器通性时，或是在试图访问一个为 `null` 对象的属性时。此外，第三方也有可能抛出异常来表示某些特定的错误。

#### 用 `try-catch` 处理错误

用函数抽象循环和条件语句那样，也需要对错误处理进行抽象。但是，用 `try-catch` 后的代码将不能组合或连在一起，这将会严重影响代码设计。

#### 函数式程序不应抛出异常

命令式的 `javascript` 代码结构有很多缺陷，而且也会与函数式的设计有兼容性问题，会抛出异常的函数存在一下问题：

- 难以与其他函数组合或链接；
- 违反了引用透明性，因为抛出异常会导致函数调用出现另一个出口；
- 会引起副作用，因为异常会在函数调用之外对堆栈引发不可预料的影响；
- 违反非局域性的原则，因为用于恢复异常的代码与原始的函数调用渐行渐远。当发生错误时，函数离开局部栈与环境；

```js
try {
  var student = findStudent("4444-444-44");

  // ... more lines of code in between
} catch (e) {
  // global context
  console.log("Error!");
}
```

- 不能只关注函数的返回值，调用者需要负责声明 `catch` 块中的异常匹配类型来管理特定的异常；
- 当有多个异常条件时会出现嵌套的异常处理块

```js

var student = null

try{
    student = findStudent('4444-444-44')

}catch(e1){
    console.log('Error: Cannot locate students by ID')

    try{
        student = findStudentByAddress(new Address(...))
    }catch(e2){
        console.log('Error: Student is no where to be found!')
    }

}

```

#### 空值（null）检查问题

```js
function getCountry(student) {
  let school = student.getSchool();
  if (school !== null) {
    let addr = school.getAddress();
    if (addr !== null) {
      var country = addr.getCountry();
      return country;
    }
    return null;
  }
  throw new Error("ERROR");
}
```

在日常开发中，碰到很多这样的场景，提取对象的属性需要判断这个对象是否是 `null` 或者 `undefined` ，这使得代码中需要大量的判断，即使使用 `try-catch` ，都是被动的解决方式。

### 一种更好的解决方案 -- `Functor`

函数式创建一个安全的容器，来存放危险代码。

#### 包裹不安全的值

```js
import * as R from "ramda";

class Wrapper {
  constructor(private value: any) {}

  map(f: Function) {
    return f(this.value);
  }

  toString() {
    return `Wrapper (${this.value})`;
  }
}

// 容器方法
const wrap = (val: any) => new Wrapper(val);

// 容器化
const wrappedValue = wrap("Get Functional");

// 读取容器内的内容
console.log(wrappedValue.map(R.identity));

// 改变容器内的内容
console.log(wrappedValue.map(R.toUpper));

```

> `map` 更加广义的概念

`map` 不仅仅是数组的 `map`，它可以映射函数到更多的类型。在函数式 `javascript` 中，`map` 只不过是一个函数，由于引用透明性，只要输入相同，`map` 永远会返回相同的结果。当然，还可以认为 `map` 是可以使用 `lambda` 表达式变换容器内的值的途径。对于数组，就可以通过 `map` 转换值，返回包含新值的新数组。

> `Wrapper` 类型使用 `map` 安全的访问和操作值，在这种情况下，通过映射 `identity` 函数就能在容器中提取值。如此一来，所有对值的操作都必须借助 `Wrapper.map` 伸入容器，从而使值得到一定的保护。

#### `Functor`（函子）定义

```bash
fmap :: (A -> B) -> Wrapper(A) -> Wrapper(B)
```

`fmap` 函数接受一个从 `A -> B` 的函数，以及一个 `Wrapper(A) Functor` ，然后返回包裹着结果的新 `Functor Wrapper(B)` 。

**`Wrapper` 内的值，在应用函数 `(A -> B)` 后再次包裹成新的容器。**

注意：`fmap` 在每次调用都会返回一个新的副本，这跟 `lenses` 类似，都是不可变的。第二个 `Wrapper` 就是一个全新的对象。

```js
Wrapper.prototype.fmap = function(f: Function) {
  return wrap(f(this.value));
};

const plus = R.curry((a, b) => a + b);

const plus3 = plus(3);

// 将2放入容器中
const twoWrapper = wrap(2);

// 调用 fmap 把 plus3 映射到新容器上
const fiveWrapper = twoWrapper.fmap(plus3);

// 5
console.log(fiveWrapper.map(R.identity));
```

`fmap` 的函数签名：

```js
interface Wrapper {
  fmap(f: Function): Wrapper;
}
```

`fmap` 返回的是 `Wrapper` 的实例，这样就可以链式地继续使用 `fmap` 。

```js
const plus5 = plus(5);

// 链式表达式
const tenWrapper = twoWrapper.fmap(plus3).fmap(plus5);

// 10
console.log(tenWrapper.map(R.identity));
```

`Functor` 也有一些重要的属性约束：

- 必须是无副作用的

若映射 `R.identity` 函数可以获得上下文中相同的值，即可证明 `Functor` 是无副作用的：

```js
// -> Wrapper('Get Functional')
wrap("Get Functional").fmap(R.identity);
```

- 必须是可组合的

```js
// 5
two
  .fmap(
    R.compose(
      plus3,
      R.tap(console.log)
    )
  )
  .map(R.identity);
```

> `Functor` 遵守这些原则，可以免于抛出异常，篡改元素或者改变函数的行为。其实际目的只是创建一个上下文或一个抽象，以便可以安全地应用操作到值，而又不改变原始值。

这也是 `map` 可以将一个数组转换到另一个数组，而不改变原数组的原因。`Functor` 就是这个概念的推广。

### 使用 `Monad`（单子）函数式地处理错误

首先先封装下 `wrap` 方法：

```js
export interface Wrapper<T> {
  fmap(f: Function): Wrapper<T>;
}

interface IWrap {
  <T>(val: T): Wrapper<T>;
}

export class Wrapper<T> {
  constructor(private value: T) {}

  map(f: IWrap) {
    return f(this.value);
  }

  toString() {
    return `Wrapper (${this.value})`;
  }
}

Wrapper.prototype.fmap = function(f: Function) {
  return wrap(f(this.value));
};

function wrapper<T>(val: T): Wrapper<T> {
  return new Wrapper(val);
}

// 容器方法
export const wrap: IWrap = wrapper;
```

```js
import * as R from "ramda";
import { wrap, Wrapper } from "./wrap";

interface IStudent {
  ssn: string;
  name: string;
}

const sayX = (x: any) => console.log("student is =>", x);

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

// 包裹对象获取逻辑，以避免找不到对象所造成的问题
const findStudent = R.curry((db, ssn) => wrap < IStudent > find(db, ssn));

// 获取容器中的值
// console.log(findStudent(DB("student"))("4444-444-44").map(R.identity));

const getName = function(student: Wrapper<IStudent>) {
  return wrap(student.fmap(R.prop("name")));
};

const studentName = R.compose(
  getName,
  R.tap(sayX),
  findStudent(DB("student"))
);

console.log(
  studentName("4444-444-44")
    .map(R.identity)
    .map(R.identity)
);
```

这样两层的 `Wrapper`，想要获取最后的结果，需要两次应用 `R.identity`，如果三层，四层这样就不好解决了。

#### `Monad`：从控制流到数据流

```js
import { wrap } from "./wrap";

// 无操作，其代表着 空 或者 无 的概念，类似 wrapper 的容器
const Empty = function() {};

// 将 map 到 Empty 上会跳过该操作
Empty.prototype.map = function() {
  return this;
};

const empty = () => new Empty();

// 检测是否数值类型且区分奇偶
const isEven = n => Number.isFinite(n) && n % 2 == 0;

// 只操作偶数，奇数则返回 empty
const half = val => (isEven(val) ? wrap(val / 2) : empty());

// Wrapper { value: 2 }
console.log(half(4));

// Empty {}
console.log(half(5));

const plus = R.curry((a, b) => a + b);

const plus3 = plus(3);

// Empty {}
console.log(half(5).fmap(plus3));
```

> `Monad` 和 `Functor` 类似。`Monad` 用户创建一个带有一定规则的容器，而 `Functor` 并不需要了解其容器的值。`Functor` 可以有效地保护数据，然而当需要组合时，即可以用 `Monad` 来安全并且无副作用地管理数据流。

```js
interface IMapFunc {
  <T>(val: T): T;
}

export class Wrapper<T> {
  constructor(private value: T) {}
  // unit 函数
  static of<P>(value: P) {
    return new Wrapper(value);
  }
  // bind 函数
  map(f: IMapFunc) {
    return Wrapper.of(f(this.value));
  }
  // 压平嵌套 wrapper
  join() {
    if (!(this.value instanceof Wrapper)) {
      return this;
    }
    return this.value.join();
  }
  toString() {
    return `Wrapper [${this.value}]`;
  }
}
```

`map` 操作被视为一种中立的 `functor`，因为它无非只是映射函数到对象，然后关闭它。之后 `Monad` 给 `map` 加入特殊的功能。
`join` 函数用于逐层扁平化嵌套结构，可以用来消除之前 `functor` 的嵌套问题。

```js
import * as R from "ramda";
import { Wrapper } from "./wrap2";

const str = Wrapper.of < string > "hello world".map(R.toUpper).map(R.identity);

// Wrapper { value: 'HELLO WORLD' }
console.log(str);

// Wrapper { value: 'Get Functional' }
console.log(Wrapper.of(Wrapper.of(Wrapper.of("Get Functional"))).join());
```

#### 使用 `Maybe Monad` 和 `Either Monad` 来处理异常

使用 `Maybe` 和 `Either` 来做以下事情：

- 隔离不纯
- 合并判空逻辑
- 避免异常
- 支持函数组合
- 中心化逻辑，用于提供默认值

> 用 `Maybe` 合并判空

`Maybe Monad` 侧重于有效整合 `null` 判断逻辑，`Maybe` 是一个包含两个具体子类型的空类型（标记类型）。

- `Just(value)` 表示值的容器
- `Nothing()` 表示要么没有值或者没有失败的附加信息。当然，还可以应用函数到 `Nothing` 上。

先写个 `maybe.ts` 基础方法

```js
/**
 * 容器类型，父类
 */
export class Maybe {
  static just(a) {
    return new Just(a);
  }
  static nothing() {
    return new Nothing();
  }
  /**
   * 由一个可为空的类型创建 Maybe
   * 如果值为空，则创建一个 Nothing；
   * 否则将值存储在 Just 子类型中来表示其存在性
   * @param a
   */
  static formNullable(a) {
    return a && a !== null ? this.just(a) : this.nothing();
  }
  static of(a) {
    return this.just(a);
  }
  get isNothing() {
    return false;
  }
  get isJust() {
    return false;
  }
}

/**
 * Just 子类型用于处理存在的值
 */
export class Just<T> extends Maybe {
  constructor(private _value: T) {
    super();
  }
  get value() {
    return this._value;
  }
  /**
   * 将映射函数应用于 Just ，变换其中的值，并存储回容器中
   * @param f
   */
  map(f) {
    // 链式时，任何一步map映射都会调用Nothing
    if (!this.value) return Maybe.nothing();
    return Maybe.of(f(this._value));
  }
  /**
   * Monad 提供默认的一元操作，用于从中获取其值
   */
  getOrElse() {
    return this.value;
  }
  filter(f) {
    Maybe.formNullable(f(this.value) ? this.value : null);
  }
  get isJust() {
    return true;
  }
  toString() {
    return `Maybe.Just (${this.value})`;
  }
}

/**
 * Nothing 子类型用于为无值的情况提供保护
 */
export class Nothing extends Maybe {
  map(f) {
    return this;
  }
  /**
   * 任何试图从 Nothing 类型中取值的操作会引发表征错误使用 Monad 的异常
   */
  get value() {
    throw new TypeError("Can not extract the value of a Nothing.");
  }
  /**
   * 忽略值，返回 other
   * @param other
   */
  getOrElse(other) {
    return other;
  }
  /**
   * 如果存在的值满足所给的断言，则返回包含值的 Just，否则，返回 Nothing
   */
  filter() {
    return this.value;
  }
  get isNothing() {
    return true;
  }
  toString() {
    return "Maybe.Nothing";
  }
}

```

```js
import * as R from "ramda";
import { Maybe } from "./maybe";

interface IAddress {
  country: string;
  city: string;
}

interface IStudent {
  ssn: string;
  name: string;
  address: IAddress;
}

const DB = (property: string) => {
  return [
    {
      name: "zhangsan",
      ssn: "4444-444-44",
      address: {
        country: "China",
        city: "nanjing"
      }
    },
    {
      name: "lisi",
      ssn: "5555-555-55",
      address: {
        country: "Japan",
        city: "dongjing"
      }
    },
    {
      name: "lucy",
      ssn: "7788-999-000"
    }
  ];
};

const find = (db: IStudent[], id: string) => {
  return R.find(R.propEq("ssn", id))(db);
};

const safeFindObject = R.curry(function(db, id) {
  return Maybe.formNullable(find(db, id));
});

const safeFindStudent = safeFindObject(DB("student"));

const safeStudentName = safeFindStudent("4444-444-44").map(R.prop("name"));

// zhangsan
console.log(safeStudentName.value);

const safeStudentName2 = safeFindStudent("77777-444-44").map(R.prop("name"));

// TypeError: Can not extract the value of a Nothing.
console.log(safeStudentName2.value);
```

使用 `Monad` 的另一个好处是，它可以修饰函数签名，以表征其返回值的不确定性，`Maybe.formNullable` 是个非常有用的函数，可用于你处理 `null` 判断。如果有合法值，调用 `safeFindStudent` 会产生一个 Just(Student)，否则返回 `Nothing` ，将 `R.prop map` 到 `Monad` 上的行为跟我们想的一样。此外，它还做了些检测程序错误和 `api` 滥用的工作：也可以用它来当参数的提前条件。如果一个无效的值被传递到 `Maybe.formNullable` ，它会产生 `Nothing` 类型，这样调用 `get()` 来打开容器将会抛出一个异常：

```js
TypeError: Can not extract the value of a Nothing
```

使用 `Monad` 应该首先想到将函数 `map` 上去，而不是直接去提取其内容。也可以使用 `getOrElse` 安全地获取其内容，如果是 `Nothing` ，则返回默认值。

```js
// Nothing 时返回 vivi
safeStudentName.getOrElse("vivi");
```

获取 `country` 时的 `null` 判断：

```js
function getCountry(student: IStudent) {
  let address = student.address;
  if (address != null) {
    return address.country;
  }
  return "Country does not exist!";
}
```

上面的只有一层，如果有多层的话，`null` 的判断将会无限回调。

```js
const getCountry = (student: Just<IStudent>) =>
  student
    .map(R.prop("address"))
    .map(R.prop("country"))
    .getOrElse("USA");

const country = R.compose(
  getCountry,
  safeFindStudent
);

// China
console.log(country("4444-444-44"));

// Nothing 触发 getOrElse 方法返回默认 USA
console.log(country("7788-999-000"));
```

`Maybe` 擅长于集中管理的无效数据的检查，但它没有（双关 `Nothing`）提供关于什么地方除了错的信息。

> 使用 `Either` 从恢复

`Either` 代表的是两个逻辑分离的值 `a` 和 `b` ，它们永远不会同时出现。

- `Left(a)` 包含一个可能的错误消息或抛出的异常对象
- `Right(b)` 包含一个成功的值

`Either` 通常操作右值，这意味着在容器上映射函数总是在 `Right(b)` 子类型上执行。它类似于 `Maybe` 的 `Just` 分支。

`either.ts` :

```js
export class Either<T> {
  constructor(protected _value: T) {}
  get value() {
    return this._value;
  }
  static left(a) {
    return new Left(a);
  }
  static right(a) {
    return new Right(a);
  }
  static fromNullable(val) {
    return val && val != null ? this.right(val) : this.left(val);
  }
  /**
   * 创建一个包含值的 Right 实例
   * @param a
   */
  static of(a) {
    return this.right(a);
  }
}

export class Right<T> extends Either<T> {
  map(f) {
    return Either.of(f(this.value));
  }
  getOrElse(other) {
    return this.value;
  }
  /**
   * 将给定函数应用于 Left 值上，不对 Right 进行任何操作
   */
  orElse() {
    return this;
  }
  /**
   * 将给定函数应用于 Right 值上并返回其结果，不对 Left 进行操作
   * @param f
   */
  chain(f) {
    return f(this.value);
  }
  /**
   * 如果 Left ，通过给定值抛出异常；否则忽略异常并返回 Right 中的合法值
   * @param _ 占位符
   */
  getOrElseThrow(_) {
    return this.value;
  }
  /**
   * 如果为 Right 且给定的断言为真时，返回包含值的 Right 结构；返回空的 Left
   * @param f
   */
  filter(f) {
    return Either.fromNullable(f(this.value) ? this.value : null);
  }
  toString() {
    return `Either.Right(${this.value})`;
  }
}

class Left extends Either<any> {
  /**
   * noop
   * 通过映射函数对 Right 结构中的值进行变换，对 Left 不进行任何操作
   * @param _ 占位符
   */
  map(_) {
    return this;
  }
  get value() {
    throw new TypeError("Can not extract the value of a Left");
  }
  /**
   * 提取 Right 的值，如果不存在，则返回给定的默认值
   * @param other
   */
  getOrElse(other) {
    return other;
  }
  /**
   * 将给定函数应用于 Left 值，不对 Right 进行任何操作
   * @param f
   */
  orElse(f) {
    return f(this._value);
  }
  /**
   * 将给定函数应用于 Right 值并返回其结果，不对 Left 进行任何操作。
   */
  chain(f) {
    return this;
  }
  /**
   * 如果为 Left ，通过给定值抛出异常，否则忽略异常并返回 Right 中的合法值
   * @param a
   */
  getOrElseThrow(a) {
    throw new Error(a);
  }
  /**
   * 如果为 Right 且给定的断言为真，返回包含值的 Right 结构; 否则返回空的 Left
   * @param f
   */
  filter(f) {
    return this;
  }
  toString() {
    return `Either.left(${this.value})`;
  }
}

```

使用 `Either` 类：

```js
import * as R from "ramda";
import { Either, Right } from "./either";

interface IAddress {
  country: string;
  city: string;
}

interface IStudent {
  ssn: string;
  name: string;
  address: IAddress;
}

const DB = (property: string) => {
  return [
    {
      name: "zhangsan",
      ssn: "4444-444-44",
      address: {
        country: "China",
        city: "nanjing"
      }
    },
    {
      name: "lisi",
      ssn: "5555-555-55",
      address: {
        country: "Japan",
        city: "dongjing"
      }
    },
    {
      name: "lucy",
      ssn: "7788-999-000"
    }
  ];
};

const find = (db: IStudent[], id: string) => {
  return R.find(R.propEq("ssn", id))(db);
};

const salfFindObject = R.curry(function(db, id) {
  return Either.fromNullable(find(db, id));
});

const findStudent = salfFindObject(DB("student"));

const ID = "4444-444-44";

const student: Right<IStudent> = findStudent(ID).orElse(() => {
  console.error(`Student not found with id ${ID}`);
});

// zhangsan
console.log(student.map(R.prop("name")).value);
```

当容器进入 `Left` 后，`getOrElse` 可以设置默认值，`orElse` 可以传递一个执行函数。

#### 使用 `IO Monad` 与外部资源交互

`IO Monad` 包装的是 `effect` 函数，而不是一个值。记住，一个函数可以看作一个等待计算的惰性的值。有了这个 `Monad` ，可以将任何 `dom` 操作都链接成一个伪引用透明的操作，并能确保所有引起副作用的函数的调用顺序不会跑偏。

`io.ts`

```js
import * as _ from "lodash";

export class IO {
  constructor(private effect: Function) {
    if (!_.isFunction(effect)) {
      throw "IO Usage: function required";
    }
  }
  static of(a) {
    return new IO(() => a);
  }
  static from(fn) {
    return new IO(fn);
  }
  map(fn) {
    return new IO(() => fn(this.effect()));
  }
  chain(fn) {
    return fn(this.effect());
  }
  run() {
    return this.effect();
  }
}

```

`demo08.ts`

```js
import * as R from "ramda";
import { IO } from "./io";

const read = (document: HTMLDocument, id: string) => () =>
  document.querySelector(`\#${id}`).innerHTML;

const write = (document: HTMLDocument, id: string) => {
  return (val: any) => {
    document.querySelector(`\#${id}`).innerHTML = val;
  };
};

const readDom = R.curry(read)(document);
const writeDom = R.curry(write)(document);

const changeToLocaleUpperCase = IO.from(readDom("student-name"))
  .map(R.toUpper)
  .map(writeDom("student-name"));

changeToLocaleUpperCase.run();
```

`demo08.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <div id="student-name">zhangsan</div>
  </body>
  <script src="./demo08-b.js"></script>
</html>
```

### `Monadic` 链式调用及组合

> 链式调用

```js
import * as R from "ramda";
import { Either } from "./either";

interface IAddress {
  country: string;
  city: string;
}

interface IStudent {
  ssn: string;
  name: string;
  address: IAddress;
}

const DB = (property: string) => {
  return [
    {
      name: "zhangsan",
      ssn: "444444444",
      address: {
        country: "China",
        city: "nanjing"
      }
    },
    {
      name: "lisi",
      ssn: "5555-555-55",
      address: {
        country: "Japan",
        city: "dongjing"
      }
    },
    {
      name: "lucy",
      ssn: "7788-999-000"
    }
  ];
};

const find = (db: IStudent[], id: string) => {
  return R.find(R.propEq("ssn", id))(db);
};

const csv = arr => arr.join(",");

const trim = (str: string) => str.replace(/\s/g, "");

const normalize = (str: string) => str.replace(/\-/g, "");

const cleanInput = R.compose(
  normalize,
  trim
);

const validLength = (len: number, str: string) => str.length === len;

const checkLengthSsn = (ssn: string) => {
  return Either.of(ssn).filter(R.partial(validLength, [9]));
};

const safeFindObject = R.curry(function(db, id) {
  return Either.fromNullable(find(db, id));
});

const findStudent = safeFindObject(DB("student"));

/**
 * chain 和 map 交叉使用，来确保 monad 只有一层，用chain来防止嵌套太深
 * @param ssn
 */
const showStudent = (ssn: string) =>
  Either.fromNullable(ssn)
    .map(cleanInput)
    .chain(checkLengthSsn)
    .chain(findStudent)
    .map(R.props(["ssn", "name"]))
    .map(csv)
    .orElse(console.error);

console.log(showStudent("4444-444-44"));
```

> 组合

```js
// 组合调用
const monadSsn = ssn => Either.fromNullable(ssn);

const map = R.curry((f, container) => container.map(f));

const chain = R.curry((f, container) => container.chain(f));

const showStudent2 = R.pipe(
  monadSsn,
  map(cleanInput),
  chain(checkLengthSsn),
  chain(findStudent),
  map(R.props(["ssn", "name"])),
  map(csv)
);

console.log(showStudent2("4444-444-44"));
```
