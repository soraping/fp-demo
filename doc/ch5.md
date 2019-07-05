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
    return a !== null ? this.just(a) : this.nothing();
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

const safeFindObject = R.curry(function(db, id) {
  return Maybe.formNullable(find(db, id));
});

const safeFindStudent = safeFindObject(DB("student"));

const safeStudentName = safeFindStudent("4444-444-44").map(R.prop("name"));

// zhangsan
console.log(safeStudentName.value);

const safeStudentName2 = safeFindStudent("77777-444-44").map(R.prop("name"));

// undefined
console.log(safeStudentName2.value);
```

> 使用 `Either` 从恢复

#### 使用 `IO Monad` 与外部资源交互

### `Monadic` 链式调用及组合
