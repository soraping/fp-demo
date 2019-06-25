> 通过函数组合创建松耦合的管道，以便能够使用独立组件更灵活的构建整个程序，这些组件可以像函数一样小，也可以像整个模块一样大，分开来看，它们并没有太大的价值，但组合在一起就会颇具意义。

### 函数链与函数管道的比较

函数的方法链展示了一种与众不同的函数式编程风格，还有一种称为管道的方法用来连接函数。

**函数式输入和输出类型之间的数学映射**。

```js
isEmpty :: String -> Boolean
```

该函数式所有 `String` 类型输入值到所有 `Boolean` 值之间的引用透明映射。

```js
const isEmpty = s => !s && !s.trim();
```

了解函数作为类型映射的性质是理解如何将函数链和管道化的关键：

- **方法链接（紧耦合，有限的表现力）**
- **函数的管道化（松耦合，灵活）**

#### 函数链

`_.chain(persons).value()` 这样的函数链的确能够极大的提高代码可读性的语法改进。然而，它与方法所属的对象紧紧的耦合在一起，限制链中可以使用的方法数量，也限制了代码的表现力。这样就只能够使用由 `lodash` 提供的操作，而无法轻松的将不同函数库的（或自定义的）函数连接在一起。

> `lodash` 提供了 `mixin` 的方法，可以扩展一个对象功能，但这需要自己去管理 `mixin` 对象本身。

#### 函数的管道化

**管道是松散结合的有向函数序列，一个函数的输出会作为下一个函数的输入。**

方法链接通过对象的方法紧密连接；而管道以函数作为组件，将函数的输入和输出松散地连接在一起。但是，为了实现管道，被连接的函数必须在元数（arity）和类型上相互兼容。

### 管道函数的兼容条件

- **类型** 函数的返回类型必须与接收函数的参数类型相匹配；
- **元数** 接收函数必须声明至少一个参数才能处理上一个函数的返回值

#### 函数的类型兼容条件

静态类型语言的优势是使用类型系统在无须运行代码的情况下发现潜在的问题。`javascript` 是弱类型语言，不太关注类型，所以，`typescript` 的静态类型检测会让 `javascript` 更加强大。

#### 函数与元数：元组的应用

元数定义为函数所接收的参数数量，也被称为函数的长度（length）。尽管在其他编程范式中，元数是最基本的，但在函数式编程中，引用透明的必然结果就是，声明的函数参数数量往往与其复杂性成正比。

> 单一参数的纯函数是最简单的，因为其实现目的非常单纯，也就意味着职责单一。因此，应该尽可能地使用具有少量参数的函数，这样的函数更加灵活和通用。然而，总是使用一元函数并非那么容易。

函数式语言通过一个称为**元组**的结构来做到这一点。元组是有限的，有序的元素列表，通常由两个或三个值成组出现，记为（a,b,c）。

元组是不可变的结构，它将不同类型的元素打包在一起，以便将它们传递到其他函数中。

### 柯里化的函数求值

**如果在函数声明时不定义任何参数，而仅依赖于函数中的 `arguments` 对象，则会使问题变得更糟。**

柯里化函数，它要求所有参数都被明确定义，因此当使用部分参数调用时，它会返回一个新的函数，在真正运行之前等待外部提供其余的参数。

柯里化是一种在所有参数被提供之前，挂起或延迟函数执行，将多参数函数转换为一元函数序列的技术。

#### 仿真函数工厂

来看个案例，从根据学生编号查询学生信息，可以从数据库中取，或者从缓存中取。

但是从调用代码的角度来看，它只关心方法的调用而并不关心来自哪里对象，运用柯里化，通过分别创建从数据库查询方法和从缓存查询方法两个函数。

在定义一个通过工厂方法 `findStudent` 函数，将函数的定义与求值分离，而其具体的实现细节可能是任意一个上面定义的查找函数。

```js
import * as R from "ramda";

const fetchStudentFromDb = R.curry((db, ssn) => {
  return find(db, ssn);
});

const fetchStudentFromArray = R.curry((arr, ssn) => {
  return arr[ssn];
});

const findStudent = useDb ? fetchStudentFromDb(db) : fetchStudentFromArray(arr);

findStudent("444-333-222");
```

`findStudent` 可以传递给其他模块，而其调用者无须了解其具体实现。从可重用的角度来说，柯里化也能够帮助开发者创建函数模版。

#### 创建可重用的函数模版

将多元函数转换为一元函数才是柯里化的主要动机，柯里化的可替代方案是偏应用和函数绑定。

### 偏应用和函数绑定

偏应用是一种通过将函数的不可变参数子集初始化为固定值来创建更小元数函数的操作。

和柯里化一样，偏应用也可以用来缩短函数的长度，但又稍有不同，因为柯里化的函数本质上是偏应用。

- **柯里化** 在每次分步调用时都会生成嵌套的一元函数。
- **偏应用** 将函数的参数与一些预设值绑定，从而产生一个拥有更少参数的新函数。该函数的闭包中包含了这些已赋值的参数，在之后的调用中被完全求值。

#### 核心语言扩展

在增强语言的表现力方面，偏应用可用于扩展如 `String` 或 `Number` 这样的核心数据类型的实用功能。

```js
import * as _ from "lodash";

declare global {
  interface String {
    first(n: number): string;
    explode(): RegExpMatchArray | null;
  }
}

String.prototype.first = _.partial(String.prototype.substring, 0);

// hel
console.log("hello world".first(3));

String.prototype.explode = _.partial(String.prototype.match, /[\w]/gi);

// [ 'a', 'b', 'c' ]
console.log("abc".explode());
```

#### 延迟函数绑定

当期望目标函数使用某个所属对象执行时，使用函数绑定来设置上下文对象就变得尤为重要。例如，浏览器中的 `settimeout` 和 `setinterval` 等函数，如果不将 `this` 的引用设为全局上下文，即 `window` 对象，是不能正常工作的。

使用 `_.bind` ， `_.partial` 和 `settimeout` 可用于创建一个简单的调度对象来执行延迟的任务。

```js
import * as _ from "lodash";

const Scheduler = (function() {
  const delayedFn = _.bind(setTimeout, undefined);
  return {
    delay5: _.partial(delayedFn, _, 5000),
    delay10: _.partial(delayedFn, _, 10000),
    delay15: _.partial(delayedFn, _, 15000)
  };
})();

// after 5 seconds!
Scheduler.delay5(() => {
  console.log("after 5 seconds!");
});
```

`_.partial` 方法参数中 `_` 是占位符，默认是下划线。

使用 `Scheduler` ，可以将任何一段代码包含在函数体中延迟的执行（运行时是无法确保计时器的精准的。）。由于 `_.bind` 和 `_.partial` 都是返回另一个函数，因此可以很容易地嵌套使用。

### 组合函数管道

> 将问题分解成更小更简单的子问题（子任务），在将其组装起来以达到业务目标的重要性，就像拼图中的一个个小块一样。函数式程序的目标就是找到哪些可以被组合的结构，这正是函数式编程的核心。

**一个有纯函数构建的程序本身也是纯的，因此能够进异步组合成更为复杂的解决放啊，而不会影响系统的其他部分。**

#### 函数组合：描述与求值分离

**函数组合是一种将已被分解的简单任务组织成复杂行为的整体过程。**

计算单词数量：

```js
import * as R from "ramda";

const str = "hello fp world";

const explode = (str: string) => str.split(/\s+/);

const count = (arr: string[]) => arr.length;

const countWords = R.compose(
  count,
  explode
);

// 3
console.log(countWords(str));
```

从函数的组成部分一眼就能看出其行为，`countWords` 被调用才会触发求值。其传递的函数（`explode` 和 `count`）在组合中是静止的。组合的结果是一个等待指定参数调用的另一个函数 `countWords` 。这是函数式组合的强大之处，将函数的描述与求值分开。

看下组合组合再组合的例子：

```js
import * as R from "ramda";
import * as _ from "lodash";

const trim = (str: string) => str.replace(/^\s*$/g, "");

const normalize = (str: string) => str.replace(/\-/g, "");

// 组合字符处理
const cleanInput = R.compose(
  normalize,
  trim
);

const validLength = (len: number, str: string) => str.length === len;

const checkLength = _.partial(validLength, 9);

// 组合
const isValid = R.compose(
  checkLength,
  cleanInput
);

const str = " 4444-444-44 ";

console.log(cleanInput(str));

console.log(isValid(str));
```

> 复杂的函数可以通过简单函数的组合来构建。由不同的模块组成的程序，也可以通过这种组合的方式来构建。

组合的概念不仅限于函数，整个程序都可以由无副作用的纯的函数或模块组合而成。

组合是一种合取操作，这意味着其元素使用逻辑与运算连接。

#### 函数式库的组合

`ramda.js` 函数式库的组合使用：

```js
import * as R from "ramda";

const students = ["zhangsan", "lisi", "wanger", "mazi"];
const grades = [80, 100, 90, 99];

const smartestStudent = R.compose(
  R.head,
  R.pluck(0),
  R.reverse,
  R.sortBy(R.prop(1)),
  R.zip
);

const student = smartestStudent(students, grades);

// list
console.log(student);
```

从下至上，一次执行。

最难的部分就是将任务分解成较小的部分，一旦完成了这一工作，就能用组合对这些函数进行重组。另外，一个令人开始意识到并开始爱上函数式组合的原因是，它能够让开发者自然地用一两行简洁的代码来描述整个解决方案。**因为已经创建了映射到算法中不同阶段的函数，所以需要构建描述这一部分解决方案的本体表达式**，从而使其他成员能更快的了解代码。

#### 应对纯的代码和不纯的代码

不纯的代码会导致外部可见的副作用，导致访问的数据超出函数的作用域，导致外部依赖关系。

但是，并不需要总保证 `100%` 的纯函数以获得函数式编程的好处。理想的情况下，**开发者需要尽可能地分离纯的行为与不纯的行为，而且最好是在同一个函数中。**

```js
import * as R from "ramda";

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

const findObject = R.curry((db, id) => {
  const obj = find(db, id);
  if (obj === null) {
    throw new Error(`Object with id ${id} not found!`);
  }
  return obj;
});

const findStudent = findObject(DB("student"));

const csv = (student: IStudent) => `${student.ssn} - ${student.name}`;

const append = R.curry((elementId, info) => {
  document.querySelector(elementId).innerHtml = info;
  return info;
});

const trim = (str: string) => str.replace(/(^\s*)|(\s*$)/g, "");

const normalize = (str: string) => str.replace(/\-/g, "");

const showStudent = R.compose(
  append("#student-info"),
  csv,
  findStudent,
  trim
);

console.log(showStudent(" 4444-444-44 "));
```

最后这段组合的代码将一个函数的输出与下一个函数的输入相连接，以 `trim` 函数作为开始，往上依次执行。

> 这种写作风格，不必像原来一样正式地声明参数来创建新的函数，函数式组合鼓励这种方法，称为 `point-free`。

#### point-free 编程

使用 `commpose` 或者 `pipe` 就意味着永远不必再声明参数了，称为函数的（`points`），这无疑会使代码更加声明式，更加简洁，或更加 `point-free`。

```js
import * as R from "ramda";

const runProgram = R.pipe(
  R.map(R.toLower),
  R.uniq,
  R.sortBy(R.identity)
);

const programList = [
  "PHP",
  "JAVA",
  "PYTHON",
  "GO",
  "PHP",
  "ASP",
  "JAVASCRIPT",
  "GO"
];

console.log(runProgram(programList));
```

### 使用函数组合子来管理程序的控制流

命令式代码能够使用 `if-else` 和 `for` 这样的过程控制机制，函数式则不能。所以，这需要一个替代方案--可以使用函数组合子。

组合子是一些可以组合其他函数或者其他组合子，并作为控制逻辑运行的高阶函数。

组合子通常不声明任何变量，也不包含任何业务逻辑，它们旨在管理函数式程序的流程。

#### identity（I-组合子）

`identity` 组合子是返回与参数同值的函数：

```js

// 函数签名
identity :: (a) -> a

// test
console.log(R.identity("test"));
```

- 为以函数为参数的更高阶函数提供数据；
- 在单元测试的函数组合器控制流中作为简单的函数结果来进行断言，可以使用 `identity` 函数来编写 `compose` 的单元测试。
- 函数式地从封装类型中提取数据。

#### tap（K-组合子）

`tap` 非常有用，它能够将无返回值的函数（记录日志，修改文件或 `html` 页面的函数）嵌入函数组合中，而无须创建其他的代码。它会将所属对象传入函数参数并返回该对象。

```bash
tap :: (a -> *) -> a -> a
```

```js
import * as R from "ramda";

const sayX = (x: any) => console.log(`X IS ${x}`);

// X IS 100
R.tap(sayX)(100);
```

> `R.tap(sayX)` 这个函数不会改变程序的结果，是一个调试函数，它会原封不动的返回这个函数的传入参数。

#### alt（OR-组合子）

`alt` 组合子能够在提供函数响应的默认行为时执行简单的条件逻辑。该组合子以两个函数为参数，如果第一个函数返回值已定义（即，不是 false,null 或 undefined），则返回该值；否则，返回第二个函数的结构。

```js
const alt = function(func1, func2) {
  return function(val) {
    return func1(val) || func2(val);
  };
};

// or

const alt = R.curry((func1, func2, val) => func1(val) || func2(val));
```

可以用这个组合子用在之前的例子：

```js
const createNewStudent = (id: string) => {
  return {
    name: "wanger",
    ssn: id
  };
};

const trim = (str: string) => str.replace(/(^\s*)|(\s*$)/g, "");

const showStudent = R.compose(
  csv,
  // 如果查不到则根据这个id重新创建一个
  alt(findStudent, createNewStudent),
  trim
);

// 4444-444-33 - wanger
console.log(showStudent(" 4444-444-33 "));
```

#### seq（S-组合子）

`seq` 组合子用于遍历函数序列。它以两个或更多的函数作为参数并返回一个新的函数，会用相同的值顺序调用所有这些函数。

```js
const seq = function(...funcArgs: Function[]) {
  return function(val: any) {
    funcArgs.forEach(function(fn) {
      fn(val);
    });
  };
};
```

这个方法可以序列化地执行相关但独立的多个操作。`seq` 组合子不会返回任何值，只会一个一个地执行一系列操作。

```js
const sayX = (x: any) => console.log(`X IS ${x}`);

const showStudent = R.compose(
  seq(append("#student-info"), R.tap(sayX)),
  csv,
  alt(findStudent, createNewStudent),
  trim
);
```

如果要将其嵌入函数组合之间，可以使用 `R.tap` 将它与其余部分进行桥接。

#### fork（join-组合子）

`fork` 组合子用于需要以两种不同的方式处理单个资源的情况。该组合子需要以 3 个函数作为参数，即以一个 `join` 函数和两个 `fork` 函数来处理提供的输入。两个分叉函数的结果最终传递到的接收两个参数的 `join` 函数中。

```js
const fork = (join, func1, func2) => val => join(func1(val), func2(val));
```
