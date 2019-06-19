class Person {
  constructor(public name: string, public country: string) {}
}

let p1 = new Person("zhangsan", "CHAIN");
let p2 = new Person("lisi", "CHAIN");
let p3 = new Person("tom", "US");

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
