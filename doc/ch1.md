### 什么是函数式

函数式编程式一种以函数使用为主的软件开发风格 。

函数式编程需要在思考解决问题的思路时有所变化，其实使用函数来获得结果并不重要，函数式编程的目标时使用函数来**抽象作用数据之上的控制流与操作**，从而在系统中**消除副作用并减少对状态的变化**。

函数式编程不是一种具体的工具，而是一种编写代码的方式。

> 必须要理解的基本概念

- 声明式编程
- 纯函数
- 引用透明
- 不可变性

#### 函数式编程是声明式编程

声明式会描述一系列的操作，但并不会暴露它们是如何实现的或是数据流是如何穿过它们。

命令式编程将计算机程序视为一系列自上而下的断言，通过修改系统的各个状态来计算最终的结果。

```js
// 命令式案例，某数字集合数组每个元素平方，并生成一个全新的数组

var array = [0, 1, 2, 3, 4];

for (let i = 0; i < array.length; i++) {
  array[i] = Math.pow(array[i], 2);
}

// [0,1,4,9,16]
console.log(array);
```

命令式编程很具体的告诉计算机如何执行某个任务。

> 声明式编程是将程序的描述与求值分离开来，它关注于如何用各种表达式来描述程序逻辑，而不一定要指明其控制流或状态的变化。

```js
var array = [0, 1, 2, 3, 4];

let newArray = array.map(function powValue(value) {
  return Math.pow(value, 2);
});

// [0,1,4,9,16]
console.log(newArray);
```

与之前的命令式代码相比，可以看出函数式的代码让开发者免于考虑如何妥善管理循环计数器以及数组索引访问的问题。

为什么要去掉代码循环，循环是一种重要的命令控制结构，但很难重用，并且很难插入其他操作中。

函数式编程旨在尽可能的提高代码的**无状态性**和**不变性**。无状态的代码不会改变或破坏全局的状态。

没有副作用和状态的变化的函数--**纯函数**

#### 副作用带来的问题和纯函数

> 函数式编程基于一个前提，即使用纯函数构建具有不变性的程序。

- 仅取决于提供的输入，而不依赖于任何在函数求值期间或调用间隔时可能变化的隐藏状态和外部状态
- 不会造成超出其作用域的变化，例如修改全局对象或引用传递的参数

```js
/**
 * 这个函数不纯，因为引用了函数作用域外的变量counter,
 */

var counter = 0;

function increment() {
  return ++counter;
}
```

函数 `increment()` 通过读取/修改一个外部变量 `counter` 而产生副作用，其结果是不可预见的，因为 `counter` 可以在调用间隔的任何时间发生改变。

很多情况下，一下副作用都有可能发生：

- 改变一个全局变量，属性或者数据结构
- 改变一个函数参数的原始值
- 处理用户输入
- 抛出一个异常，除非它又被当前函数捕获了
- 屏幕打印或者记录日志
- 查询 html 文档，浏览器的 cookie 或者访问数据库

```js
function showStudent(ssn) {
  var student = db.get(ssn);
  if (student != null) {
    document.querySelector(`#${elementId}`).innerHTML = `${student.ssn}, ${
      student.name
    }`;
  } else {
    throw new Error("student not found!");
  }
}

showStudent("S1234-4321");
```

上面的函数将一些副作用暴露到其他作用域之外：

- 该函数主要是为了查询数据，在函数体内，与一个外部变量 `db` 进行了交互，因为该函数签名中并没有声名该参数，在任何一个时间点，这个引用可能为 `null` ，或在调用间隔改变，从而导致完全不同的结果并破坏了原函数的完整性
- 全局对象 `elementId` 可能随时改变
- `html` 元素被直接修改了。`html` 文档 `dom` 本身是一个可变的，共享的全局资源
- 如果没有查询到数据，该函数会抛出一个异常，这将导致整个程序的栈回退并突然结束

改进点：

- 将这个长函数分离成多个具有单一职责的短函数
- 通过显式地将完成功能所需的依赖都定义为函数参数来减少副作用的数量

```js
// 1.查询操作
var find = (db, id) => {
  var obj = db.get(id);
  if (obj == null) {
    throw new Error("object not found!");
  }
  return obj;
};

// 2.输出文字
var csv = student => {
  return `${student.ssn}, ${student.name}`;
};

// 3.页面展示
var append = (elementId, info) => {
  document.querySelector(elementId).innerHTML = info;
};

// 4.组合
var showStudent = compose(
  append("#student-info"),
  csv,
  find(db)
);
showStudent("S1234-4321");
```

- 声明式代码风格提供了程序需要执行的那些高阶步骤的一个清晰视图，增强了代码的可读性
- 与 `html` 对象的交互被移到了一个单独的函数内，将纯函数从不纯的行为中分离出来

#### 引用透明和可置换性

> 引用透明是定义一个纯函数较为正确的方式，纯度在这个意义上表明一个函数的参数和返回值之前映射的纯的关系。**因此，如果一个函数对于相同的输入始终产生相同的结果，那么就说它是引用透明的**。

```js
var counter = 0;
function increment() {
  return ++counter;
}
```

这个 `increment` 函数依赖外部的 `counter` 的变量，导致每次执行的结果都不相同，为了使其引用透明，需要删除其依赖的外部变量，使其成为函数签名中显式定义的参数。

```js
var increment = counter => counter + 1;
```

这个函数每次执行传参数执行的结果都是相同的，所以它是稳定的，引用透明（等式正确性）。

#### 存储的不可变数据

`javascript` 中所有基本类型从本质上是不可变的，但是其他对象，例如数组，都是可变的，即使它们作为输入传递给另一个函数，仍然可以通过改变原有的内容的方式产生副作用。

```js
var sortDesc = function(arr) {
  return arr.sort(function(a, b) {
    return b - a;
  });
};

var arr = [1, 2, 3, 4, 5, 6];

// [6,5,4,3,2,1]
sortDesc(arr);

// [6,5,4,3,2,1]
console.log(arr);
```

函数 `sortDesc` 是将数组降序，上面的函数执行的结果如预期一样，但是，`array.sort` 函数是有状态的，会导致在排序的过程中产生了副作用，因为原始的引用 `arr` 被修改了。这个缺陷会在后续中克服。

**函数式编程是指为创建不可变的程序，通过消除外部可见的副作用，来对纯函数的声明式的求值过程。**

现今面临的问题都是有大量使用严重依赖外部共享变量的，存在太多分支的以及没有清晰的结构大函数所造成。即使是一些由很多文件组成并执行得很成功的应用，也会形成一种共享的可变全局数据网，难以跟踪和调试。

### 函数式编程的优点

除了函数式的优势，更应该开始思考函数式的现实意义。

#### 复杂任务的分解

从宏观上讲，函数式编程实际上是分解（将程序拆为小片段）和组合（将小片段连接到一起）之间的相互作用。正是这种二元性，是的函数式程序如此模块化和高效。这里的模块化单元（功能单元）就是函数本身。

**函数式思维的学习通常始于将特定任务分解为逻辑子任务（函数）的过程。**

如果需要，这些子任务可以进一步分解，直到成为一个个简单的，相互独立的纯函数功能单元。

#### 使用流式链来处理数据

```js
let persons = [
  { name: "zhangsan", age: 30 },
  { name: "lisi", age: 20 },
  { name: "wanger", age: 40 }
];

_.chain(enrollment)
  .filter(person => person.age > 30)
  .pluck("name")
  .value();
```

`ladash` 函数链是一种惰性计算程序，这意味着当需要时才会执行，可以避免执行可能包含一些永不会使用的内容的整个代码序列，节省宝贵的 `cpu` 计算周期，`.value()` 会触发整个链上的所有的操作。

#### 复杂异步应用中的响应

常规开发每天都需要处理哪些在服务端或客户端中的异步和事件驱动的代码，而你可以使用响应式编程来大幅降低这些代码的复杂性。

响应式编程能够提高代码的抽象级别，使你忘记与异步和事件驱动程序创建的相关样板代码，从而更专注于具体的业务逻辑，此外，这种新兴范式能够充分利用函数式编程中的函数链和组合的优势。
