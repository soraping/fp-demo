### 理解程序的控制流

程序为实现业务目标所要行进的路径被称为 **控制流**。

命令式程序需要通过暴露所有的必要步骤才能极其详细的描述其控制流。这些步骤通常涉及大量的循环和分支，以及随语句执行变化的各种变量。

声明式程序，特别是函数式程序，则多使用以简单拓扑连接的独立黑盒操作组合而成的较小结构化控制流，从而提升程序的抽象层次。这些连接在一起的操作只是一些能够将状态传递至下一个操作的高阶函数。

**使用函数式开发风格操作数据结构，其实就是将数据与控制流视为一些高阶组件的简单连接。**

```js
optA()
  .optB()
  .optC()
  .optD();
```

连接黑盒操作的函数式控制流程。信息在一个操作与下一个（独立的纯函数）操作之间独立地流动。高阶抽象使得分支和迭代明显减少或甚至被消除。

采用这种链式操作能够使程序简洁流畅，能够从计算逻辑中很好的分离控制流，因此可以使得代码更易推理。

### 链接方法

**方法链**是一种能够在一个语句中调用多个方法的面向对象编程模式。当这些方法属于同一个对象时，方法链又称为**方法级联**。

```js
// FUNCTION is haha
"function programming".substring(0, 9).toUpperCase() + "is haha";
```

`substring` 和 `toUpperCase` 都是通过 `this` 在隶属的字符串对象上操作并返回一个新字符串的方法。

通过一些列的变化后的结果与原先的字符串毫无引用关系，而原先的字符串也不会有任何变化。

用函数式的风格重构：

```js
concat(toUpperCase(substring("function programming", 0, 9)), "is haha");
```

所有参数都应在函数声明中明确定义，而且它没有副作用，也不会修改原有对象。但，这样的代码写起来并没有方法链流畅，而且难以阅读，需要一层层地剥离外部函数，才能知晓内部真正发生的事情。

### 函数链

函数式编程使用如数组这样的普通类型，并施加在一套粗粒度的高阶操作之上，这些操作是底层数据形态所不可见的。设计如下：

- 接收函数作为参数，以便能够注入解决特定任务的特定行为
- 代替充斥临时变量与副作用的传统循环结构，从而减少所要维护以及可能出错的代码

#### lambda 表达式（箭头函数）

`lambda` 表达式适用于函数式的函数定义，因为它总是需要返回一个值。

一等函数与 `lambda` 表达式之间的关系，函数名代表的不是一个具体的值，而是一种（惰性计算的）可获取其值的描述。换句话说，函数名只想的是代表着如何计算该数据的箭头函数。这就是在函数式编程中可以将函数作为数值使用的原因。

#### 用 map 做数据变换

实现 `map`：

```js
function map<T>(arr: T[], fn: (item: T, index: number, arr: T[]) => any) {
  let idx = -1,
    len = arr.length,
    result = new Array(len);
  while (++idx < len) {
    result[idx] = fn(arr[idx], idx, arr);
  }
  return result;
}

type TStringArray = string[];

let arr: TStringArray = ["zhangsan", "lisi", "wanger", "mazi"];

// [ 'zhangsan haha', 'lisi haha', 'wanger haha', 'mazi haha' ]
let newArr =
  map <
  string >
  (arr,
  (item, index, arr) => {
    return item + " haha";
  });
```

#### 用 reduce 收集结果

高阶函数 `reduce` 将一个数组中的元素精简为单一的值，该值是由一个元素与一个累积值通过一个函数计算得出。

```bash
reduce(f, [e0, e1, e2], accum) -> f(f(f(acc, e0), e1), e2) -> R
```

简单实现：

```js
type TReduceFn<T> = (prev: any, cur: T, index?: number, arr?: T[]) => any;

function reduce<T>(arr: T[], fn: TReduceFn<T>, acc: any) {
  let idx = -1,
    len = arr.length;
  if (!acc && len > 0) {
    acc = arr[++idx];
  }
  while (++idx < len) {
    acc = fn(acc, arr[idx], idx, arr);
  }
  return acc;
}

let students = [
  {
    name: "zhangsan",
    score: 20
  },
  {
    name: "lisi",
    score: 12
  },
  {
    name: "wanger",
    score: 30
  }
];

interface IStudent {
  name: string;
  score: number;
}

let total =
  reduce <
  IStudent >
  (students,
  (sum, cur) => {
    if (typeof sum === "string") {
      sum = parseInt(sum);
    }
    return sum + cur.score;
  },
  "0");

// 62
console.log(total);
```

`map - reduce` 组合：

```bash
arr.map(func1).reduce(func2)
```

其中，`func1` 和 `func2` 用于实现所需的特定行为。

```js
import * as _ from "lodash";
let students = [
  {
    name: "zhangsan",
    score: 20
  },
  {
    name: "lisi",
    score: 12
  },
  {
    name: "wanger",
    score: 30
  }
];

const getScore = student => student.score;

const getTotal = (prev, score) => prev + score;

let total = _(students)
  .map(getScore)
  .reduce(getTotal, 0);

console.log(total);
```

先用 `map` 将对象数组进行预处理，提取出想要的信息字段，再使用 `reduce` 来收集最终的结果。

#### 用 filter 删除不需要的元素

在处理较大数据集合时，往往需要删除部分不能参与计算的元素。

```js
type TPredicate<T> = (value: T, index: number, target?: any) => boolean;

function filter<T>(arr: T[], predicate: TPredicate<T>) {
  let idx = -1,
    len = arr.length,
    result = [];

  while (++idx < len) {
    let value = arr[idx];
    if (predicate(value, idx, this)) {
      result.push(value);
    }
  }

  return result;
}

let arr = [1, 2, 3, 4, 5, 6];

let newArr = filter < number > (arr, (value, index) => value > 3);

// [ 4, 5, 6 ]
console.log(newArr);
```

`predicate` **谓词函数**，其结果为真，则保留，否则略过。

### 代码推理

函数式的控制流能够在不需要研究任何内部细节的条件下提供该程序意图的清晰结构，这样就能更深刻地了解代码，并获知数据在不同阶段是如何流入和流出的。

#### 声明式惰性计算函数链

函数式编程的声明式模型将程序视为对一些独立的纯函数的求值，从而在必要的抽象层次之上构建出流畅且表达清晰的代码。**这样就可以构成一个能够清晰表达应用程序意图的本体或词汇表**。

例如用 `map` `reduce` `filter` 这样的基石来搭建纯函数，可使代码易于推理并一目了然。

给一组姓名 去重 首字母大写 排序等操作：

```js
import * as _ from "lodash";

let names = ["zhangsan", "list", "wanger", "list", "mazi", "haha", ""];

let newNames = _.chain(names)
  .filter(name => !!name)
  .uniq()
  .map(_.startCase)
  .sort()
  .value();

// [ 'Haha', 'List', 'Mazi', 'Wanger', 'Zhangsan' ]
console.log(newNames);
```

`_.chain(names)` 的好处就是可以创建一个惰性计算能力的复杂程序，在调用 `.value()` 前，并不会真正地执行任何操作，在不需要其结果的情况下，可以跳过运行所有函数。

#### 类 sql 的数据：函数即数据

```js
import * as _ from "lodash";

interface IPerson {
  name: string;
  age: number;
  country: string;
}

declare module "lodash" {
  interface LoDashStatic {
    filterPerson(person: IPerson): boolean;
  }
  interface LoDashExplicitWrapper<TValue> {
    filterPerson(): this;
  }
  interface LoDashImplicitWrapper<TValue> {
    filterPerson(): this;
  }
}

let persons: IPerson[] = [
  {
    name: "zhangsan",
    age: 30,
    country: "CHAIN"
  },
  {
    name: "lisi",
    age: 33,
    country: "CHAIN"
  },
  {
    name: "John",
    age: 27,
    country: "US"
  },
  {
    name: "David",
    age: 19,
    country: "England"
  },
  {
    name: "Alan",
    age: 15,
    country: "US"
  }
];

const filterPerson = (persons: IPerson[]) => {
  return _.filter(persons, person => person.age > 20 && person.country != "US");
};

_.mixin({ filterPerson });

let personPluck = _.chain(persons)
  .filterPerson()
  .sortBy(["name", "age"])
  .map("name")
  .value();

// [ 'lisi', 'zhangsan' ]
console.log(personPluck);

```

这样的链式操作，是不是很像 `sql` 一样，还有什么比使用查询语言的语义来解析数据更好的方法吗，函数即数据。因为它是声明式的，描述了**数据输出是什么，而不是数据是如何得到的**。

**我们不需要任何常见的循环语句，相反，应该用高阶抽象代替循环**。

> 另一种替换循环的常见技术是递归，尤其当处理一些 "自相似" 的问题时，可以用其来抽象迭代。对于这些类型的问题，序列函数链会显得效率低下或不适用。而递归实现了自己的处理数据方式，从而大大缩短了标准循环的执行时间。

### 学会递归的思考

有时，要解决的问题是困难且复杂的，这种情况下，开发者应该立刻去寻找方法来分解它。如果问题可以分解成较小的问题，就可以逐个解决，再将这些结论组合起来构建出整个问题的解决方案。

#### 递归的释义

递归是一种旨在通过将问题分解成较小的自相似问题来解决问题本身的技术，将这些个的自相似问题结合在一起，就可以得到最终的解决方案。

**递归地思考需要考虑递归自身以及自身的一个修改版本。**

实现数组内元素之和：

```js

let nums = [1,2,3,4,5...]

_(nums).reduce((acc, current) => acc + current, 0)

```

使用 `_.reduce()` 函数无需考虑循环，甚至是数组的大小。可以通过将第一个元素添加到其余部分来计算结果，从而实现递归思维。这种思想过程可以想象成如下的序列求和操作，这被称为**横向思维**。

```bash

sum[1,2,3,4,5,6,7,8,9] = 1 + sum[2,3,4,5,6,7,8,9]
                       = 1 + 2 + sum[3,4,5,6,7,8,9]
                       = 1 + 2 + 3 + sum[4,5,6,7,8,9]

```

递归和迭代是一枚硬币的两面，在不可变的条件下，递归提供了一种更具表现力，强大且优秀的迭代替代方法。事实上，纯函数语言甚至没有标准的循环结构，如 `do for while` ，因为所有循环都是递归完成的。递归使代码更易理解，因为它是以多次在较小的输入上重复相同的操作作为基础的。

递归包括两个方面：

- 基例（终止条件）
- 递归条件

```js
function sum(arr) {
  if (_.isEmpty(arr)) {
    return 0;
  }
  return _.first(arr) + sum(_.rest(arr));
}
```

递归条件，使用更小一些的输入集调用自身，这里通过 `_.first _.rest` 缩减输入。空数组返回 0，则满足基例。而对于非空数组，就会继续将第一个元素于数组的其余部分递归求和。从底层来看，递归调用会在栈中不断堆叠。当算法满足终止条件时，运行时就会展开调用栈并执行加操作，因此所有返回语都将被执行。递归就是通过语言运行时这种机制代替了循环。

#### 递归定义的数据结构

```js

import * as _ from "lodash";
import { isValid } from "./utils";

class Person {
  constructor(private country: string, private name: string) {}

  get fullName() {
    return this;
  }
}

class Tree {
  constructor(public _root: Node) {}
  static map(node: Node, fn: (p: Person) => Person, tree = null) {
    node.value = fn(node.value);
    if (!tree) {
      return new Tree(node);
    }
    if (node.hasChildren()) {
      _.map(node.children, child => {
        Tree.map(child, fn, tree);
      });
    }
    return tree;
  }
  get root() {
    return this._root;
  }
}

class Node {
  constructor(
    private _val: Person,
    private _parent?: any,
    private _children: any[] = []
  ) {}

  isRoot() {
    return isValid(this._parent);
  }

  get children() {
    return this._children;
  }

  hasChildren() {
    return this._children!.length > 0;
  }

  get value() {
    return this._val;
  }

  set value(val) {
    this._val = val;
  }

  append(child: Node) {
    child._parent = this;
    this._children!.push(child);
    return this;
  }

  toString() {
    return `Node (val: ${this._val}), children; ${this._children!.length})`;
  }
}

let zhangsan = new Node(new Person("zhangsan", "China"));
let lisi = new Node(new Person("lisi", "China"));
let tom = new Node(new Person("tom", "US"));
let jim = new Node(new Person("jim", "England"));
let john = new Node(new Person("john", "US"));

zhangsan.append(lisi).append(jim);
lisi.append(tom).append(john);

let tree = Tree.map(zhangsan, p => p.fullName);

console.log(tree);


```
