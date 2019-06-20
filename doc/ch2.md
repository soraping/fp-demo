### 函数式与面向对象的程序设计

面向对象的应用程序大多是命令式的，因此在很大的程度上依赖于使用基于对象的封装来保护其自身和集成的可变状态的完成性，在通过实例方法来暴露或修改这些状态。其结果是，对象的数据与其具体的行为以一种内聚的包裹的行式紧耦合在一起。而这就是面向对象程序的目的，也正解释了为什么对象是抽象的核心。

函数式编程不需要对调用者隐藏数据，通常使用一些更小且非常简单的数据类型。由于一切都是不可变的。换句话说，数据与行为是松耦合的。函数式代码使用的是可以横切或工作于多种数据类型之上的更加粗粒度的操作，而不是一些细粒度的实例方法。在这种范式中，函数成为抽象的主要形式。

面向对象的程序设计通过特定的行为将很多数据类型逻辑地连接在一起，函数式编程则关注如何在这些数据类型之上通过组合来连接各种操作。

```js

class Person {
  constructor(public firstName: string, public lastName: string) {}

  get fullName() {
    return `${this.firstName} - ${this.lastName}`;
  }
}

class Student extends Person {

}

let p = new Student("zhang", "san");

console.log(p.fullName);

let fullName = (person: Person) => `${person.firstName} - ${person.lastName}`;

console.log(fullName(p));


```

fullName 分离至独立函数，可以避免使用 `this` 引用来访问对象数据。使用 `this` 的缺点是它给予了超出方法作用域的实例层级的数据访问能力，从而可能导致副作用。使用函数式编程，对象数据不再与代码的特定部分紧密耦合，从而更具重用性和可维护性。

**面向对象的关键式创建继承层次结构（如继承 Person 的 Student 对象）并将方法与数据紧密的绑定在一起。函数式编程则更倾向于通过广义的多态函数交叉应用于不同的数据类型，同是避免使用 `this` 。**

案例：找到与给定学生生活在同一个国家且同一个学校的朋友：

```js

class Person {
  constructor(public name: string, public country: string) {}

  // 找到同一个学校的朋友
  personInSameCountry(friends: Student[]): Student[] {
    var result = [];
    for (let idx in friends) {
      var friend = friends[idx];
      if (this.country == friend.country) {
        result.push(friend);
      }
    }
    return result;
  }
}

class Student extends Person {
  constructor(
    public name: string,
    public country: string,
    public school: string
  ) {
    super(name, country);
  }

  // 找到同一个学校的朋友
  studentInSameCountryAndSchool(friends: Student[]) {
    let schoolFriends = super.personInSameCountry(friends);
    let result = [];
    for (let idx in schoolFriends) {
      let schoolFriend = schoolFriends[idx];
      if (this.school == schoolFriend.school) {
        result.push(schoolFriend);
      }
    }
    return result;
  }
}

let zhagnsan = new Student("zhangsan", "China", "qinghua");

let lisi = new Student("lisi", "China", "beida");

let tom = new Student("tom", "USA", "mashen");

let lucy = new Student("lucy", "USA", "sitanfu");

let jim = new Student("jim", "USA", "mashen");

let result = tom.studentInSameCountryAndSchool([zhagnsan, lisi, lucy, jim]);

// [ Student { name: 'jim', country: 'USA', school: 'mashen' } ]
console.log(result);

```

以上是面向对象的处理方式，通过 `this` 和 `super` 将各种操作与当前对象以及父级对象紧紧耦合在一起。

函数式编程的解决方案就是将问题分解为很小的函数：

```js
let selectorHOC = (student: Student) => {
  return (friend: Student) => {
    return friend.country == student.country && friend.school == student.school;
  };
};

let findStudent = (students: Student[], selector) => {
  return students.filter(selector);
};

let result2 = findStudent([zhagnsan, lisi, lucy, jim], selectorHOC(tom));

// [ Student { name: 'jim', country: 'USA', school: 'mashen' } ]
console.log(result2);
```

`selectorHOC` 是一个高阶函数，它接收指定的学生为参数。`findStudent` 是一个过滤函数，它的参数是待查询列表和过滤器，这个过滤器就是 `selectorHOC` 执行后的返回值。

面向对象的设计着重于数据及数据之间的关系，函数式编程则关注于操作如何执行，即行为。

重要性质的比较

| 性质       | 函数式                           | 面向对象                 |
| ---------- | -------------------------------- | ------------------------ |
| 组合单元   | 函数                             | 对象（类）               |
| 编程风格   | 声明式                           | 命令式                   |
| 数据和行为 | 独立且松耦合的纯函数             | 与方法紧耦合的类         |
| 状态管理   | 将对象视为不可变的值             | 主张通过实例方法改变对象 |
| 程序流控制 | 函数与递归                       | 循环与条件               |
| 现成安全   | 可并发编程                       | 难以实现                 |
| 封装性     | 因为一切都不可变的，所以没有必要 | 需要保护数据的完整性     |

#### 管理 `javascript` 对象的状态

JavaScript 的对象是高度动态的，其属性可以在任何时间被修改，增加或者删除。

**程序的状态可以定义为在任一时刻存储在所有对象之中的数据快照。**

#### 将对象视为数值

```js

function zipCode(code, location){

    let _code = code || ""
    let _location = location || ""

    return {
        code: function(){
            return _code;
        },
        location: function(){
            return _location;
        },
        fromString: function(str){
            let parts = str.split("-")
            return zipCode(parts[0], parts[1])
        },
        toString: function(){
            return _code + '-' + _location
        }
    }

}

cost princetonZip = zipCode("08544", "3345");

// 08544-3345
princetonZip.toString();

```

通过返回一个对象字面接口来公开一小部分方法给调用者，这样就可以将 `_code` 和 `_location` 视为伪私有变量，这种方法就被称为**值对象**模式。

返回的对象可以表现出像原始类型一样没有可变方法的行为。尽管 `toString` 方法不是纯函数，但其行为与纯函数无异，就是该对象的纯字符串表示。值对象是一种可简单应用于面向对象和函数式编程的轻量级方式。

#### 深冻结可变部分

`Object.freeze()` 函数可以通过将该属性设置为 false 来阻止对象状态的改变。

```js
var person = Object.freeze(new Person("zhangsan", "China"));

// 无效，不会发生改变
person.name = "list";

// {name: "zhangsan", country: "China"}
person;
```

`Object.freeze()` 也可以冻结继承而来的属性，因此，也可以用同样的方法冻结 `Student` 实例。但是它不能被用于冻结嵌套对象属性。

```js

class Address {
  constructor(public _country, public _city, public _zipCode) {}
}

class Person {
  constructor(public _name, public _address) {}
}

let address = new Address("China", "nanjing", zipCode("08544", "3345").toString());

let address2 = new Address("Chain", "beijing", zipCode("2222", "3333").toString());

let person = Object.freeze(new Person("zhangsan", address));

// 操作一： 无效
person._address = address2

// Person {_name: 'zhangsan', _address: Address { _country: 'China', _city: 'nanjing', _zipCode:'08544-3345' } }
console.log(person)

// 操作二：生效
address._city = "beijing";

// Person {_name: 'zhangsan', _address: Address { _country: 'China', _city: 'beijing', _zipCode:'08544-3345' } }
console.log(person)

```

操作一是无效的，应该使用了 `Object.freeze()` 保护，但是它是一种浅操作，所以对这种嵌套结构，操作二是生效的，所以就要用递归来冻结对象：

```js
let isObject = val => val && typeof val === "object";

function deepFreeze(obj) {
  if (isObject(obj) && !Object.isFrozen(obj)) {
    Object.keys(obj).forEach(key => deepFreeze(obj[key]));
  }
  return obj;
}
```

`Object.isFrozen()` 方法可以判断一个对象是否已经被冻结。

#### 使用 Lenses（透镜）定位并修改对象图

`Lenses` 被称为函数式引用，是函数式程序设计中用于访问和不可改变地操纵状态数据类型属性的解决方案。

`Lenses` 将 "getter" 和 "setter" 函数组合为一个单一模块。 `ramda.js` 函数式库中提高了 `Lenses` 实现。

```js
import * as R from "ramda";

const person = {
  name: "zhangsan",
  age: 20
};

const nLens = R.lensProp("name");

// zhangsan
console.log(R.view(nLens, person));

// 将字母大写
const result = R.over(nLens, R.toUpper, person);

// { name: 'ZHANGSAN', age: 20 }
console.log(result);
```

创建透镜：

- `lensProps` ：创建关注对象某一属性的透镜
- `lensPath` ： 创建关注对象某一嵌套的透镜
- `lensIndex`： 创建关注数组某一索引的透镜

操作透镜：

- `view` ： 读取透镜的值
- `set` ： 更新透镜的值
- `over` ： 将变换函数作用于透镜

`set` 和 `over` 会按照指定的方式对被透镜关注的属性进行修改，并返回整个新的对象。

```js
import * as R from "ramda";

const stutent = {
  name: "lisi",
  age: 18,
  school: {
    class: "one",
    row: 2
  }
};

const schoolLens = R.lensPath(["school", "class"]);

// one
console.log(R.view(schoolLens, stutent));

let stutentResult = R.set(schoolLens, "two", stutent);

// { name: 'lisi', age: 18, school: { class: 'two', row: 2 } }
console.log(stutentResult);

// one
console.log(R.view(schoolLens, stutent));

// two
console.log(R.view(schoolLens, stutentResult));
```

函数式已经有了 `getter` 和 `setter` 的语义。除了提供一种不可变的保护性的包装器之外，`Lenses` 也与函数式编程的分离对象与字段访问逻辑的哲学思想非常契合，即消除了对 `this` 的依赖，并提供了很多能够操作对象内容的强大的函数。

### 函数

**函数是函数式编程的工作单元与中心。**

`javascrip` 函数有两个重要特性：一等的和高阶的。

#### 一等函数

```js
function multiplier(a, b) {
  return a * b;
}

// 匿名函数
var multiplier = function(a, b) {
  return a * b;
};

// lambda 函数
var multiplier = (a, b) => a * b;

// 作为成员方法给对象的属性赋值
var obj = {
  method: (a, b) => a * b
};

// 通过构造函数来实例化
var multiplier = new Function("a", "b", "return a * b");
```

构造函数以函数形参，函数体为参数，并需要使用 `new` 关键字，在 `javascript` 中，任何函数都是 `Function` 类型的一个实例。

#### 高阶函数

函数行为与普通对象类似，可以作为其他函数的参数进行传递，或是由其他函数返回。这些函数则称为高阶函数。

通过组合一些小的高阶函数来创建有意义的表达式，可以简化很多烦琐的程序。

案例：打印来自 `US` 的人员

```js

class Person {
  constructor(public name: string, public country: string) {}
}

let p1 = new Person("zhangsan", "CHAIN");
let p2 = new Person("lisi", "CHAIN");
let p3 = new Person("tom", "US");

function printPeopleInTheUs(peoples: Person[]) {
  for (let i = 0; i < peoples.length; i++) {
    let person = peoples[i];
    if (person.country === "US") {
      console.log(person);
    }
  }
}

printPeopleInTheUs([p1, p2, p3]);

```

> 如果还需要支持打印其他国家的人，通过高阶函数，可以很好的抽象出应用于每个人的操作，可以给高阶函数 `printPeopleInTheUs` 提供任何 `action` 函数：

```js
function action(person: Person) {
  if (person.country === "US") {
    console.log(person);
  }
}

function printPeopleInTheUs(peoples: Person[], action) {
  for (let i = 0; i < peoples.length; i++) {
    let person = peoples[i];
    action(person);
  }
}

printPeopleInTheUs([p1, p2, p3], action);
```

> `javascript` 中显著的命名模式之一是使用如 `multiplier` , `comparator` 以及 `action` 这样的受事名词。

```js
function printPeopleInTheUs(peoples: Person[], selector, printer) {
  for (let i = 0; i < peoples.length; i++) {
    let person = peoples[i];
    if (selector(person)) {
      printer(person);
    }
  }
}

var isUs = (person: Person) => person.country === "US";

printPeopleInTheUs([p1, p2, p3], isUs, console.log);
```

**通过使用高阶组件，开始呈现出声明式的模式。表达式清晰地描述了程序需要做的事情。**

#### 函数调用的类型

- 作为全局函数

```js
function name() {}

name();
```

- 作为方法

```js
var obj = {
  prop: "song property",
  getProps: function() {
    return this.prop;
  }
};

obj.getProps();
```

- 作为构造函数与 `new` 一起使用

```js
function Person(name) {
  this.name = name;
}

let person = new Person("zhangsan");
```

> `this` 的引用取决于函数式如何使用的（如全局的，或是作为对象方法，或是作为构造函数），而不是取决于函数体中的代码。由于需要特别关注函数是如何被执行的，因此这回导致代码难以理解。正如上文不断提出的，**在函数式代码中很少会使用 `this` （事实上，应不惜一切代价来避免使用它）。** 但在一些库和工具中，它被大量使用，以及在一些特殊情形下改变语言环境来实现一些难以置信的功能。这些往往会涉及 `apply` 以及 `call` 方法。

#### 函数的方法

`apply` 以及 `call` 方法通过修改函数上下文可以灵活地应用在许多不同的技术中，但函数式编程并不鼓励这样，**因为它永远不会依赖函数的上下文状态，所有的数据都应以参数的形式提供给函数**。

### 闭包和作用域

**闭包**是一种能够在函数声明过程中将环境信息与所属函数绑定在一起的数据结构。它是基于函数声明的文本位置的，因此也被称为围绕函数定义的静态作用域或词法作用域。闭包不仅应用于函数式的高阶函数中，也用于事件处理和回调，模拟私有成员变量，还能弥补一些 `javascript` 不足。

从本质上讲，闭包就是函数继承而来的作用域，这类似于对象方法是如何访问其继承的实例变量的。它们都具有其父类型的引用，在内嵌函数中能够很清楚地看到闭包。

```js
function makeAddFunction(amount) {
  return function add(number) {
    return number + amount;
  };
}

var addTenTo = makeAddFunction(10);

// 17
addTenTo(7);
```

`add` 函数可以通过词法绑定访问到 `amount` 变量。尽管 `add` 函数中的变量 `amount` 并不存在返回函数的活动作用域中，但通过调用返回函数仍然可以访问它们。**从本质上讲，可以想象内嵌函数 `add` 在声明式中不仅包含其计算逻辑，也包含其周围所有变量的快照。**

#### 全局作用域

任何对象和在脚本最外层声明的（不在任何函数中的）变量都是全局作用域的一部分，并且可以被所有 `javascript` 代码访问。函数式编程的目的就是为了防止任何可被观测的变化影响到函数之外的部分，然而在全局作用域内，每执行一行都会导致明显变化。

如果 `javascript` 代码不是以模块化打包的，那么这样很容易导致命名空间冲突。全局命名空间的污染会导致很多问题，很容易导致不同文件中定义的变量和函数被重写。

#### 函数作用域

`javascript` 的函数作用域是主推的作用域机制。在函数中声明的任何变量都是局部且外部不可见的。同时，在函数返回后，其声明的任何局部变量都会删除。

#### 伪块作用域

`{}` 包裹的代码块，隶属于各种控制结构，如 `for if while switch` 语句，不能被外部访问。

#### 闭包的实际应用

> 模拟私有变量

闭包可以用来管理全局命名空间，以免在全局范围内共享数据。一些库和模块还会使用闭包来隐藏整个模块的私有方法和数据。这被称为模块模式，它采用了立即调用函数表达式（IIFE）,在封装内部变量的同时，允许对外公开必要的功能集合，从而有效的减少了全局引用。

```js
var myModule = (function module() {
  let _myPrivate = "123";
  let method1 = function() {
    console.log("method111");
    console.log(_myPrivate);
  };

  let method2 = function() {
    console.log("method222");
  };

  return {
    method1,
    method2
  };
})();

myModule.method1();
```

`myModule` 全局定义，会在脚本执行时立即执行，变量 `_myPrivate` 被包裹在函数局部作用域内，外部是无法访问到的，函数内部定义了两个公开方法，这两个方法利用闭包使得返回的对象能够安全的访问模块中所有的私有变量。

> 异步服务端调用

> 模拟块作用域变量
