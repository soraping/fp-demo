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
