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

console.log(personPluck);
