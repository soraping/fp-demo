function zipCode(code, location) {
  let _code = code || "";
  let _location = location || "";

  return {
    code: function() {
      return _code;
    },
    location: function() {
      return _location;
    },
    fromString: function(str) {
      let parts = str.split("-");
      return zipCode(parts[0], parts[1]);
    },
    toString: function() {
      return _code + "-" + _location;
    }
  };
}

class Address {
  constructor(public _country, public _city, public _zipCode) {}
}

class Person2 {
  constructor(public _name, public _address) {}
}

let address = new Address(
  "China",
  "nanjing",
  zipCode("08544", "3345").toString()
);

let address2 = new Address(
  "Chain",
  "beijing",
  zipCode("2222", "3333").toString()
);

let person2 = Object.freeze(new Person2("zhangsan", address));

console.log(person2);

address._city = "beijing";

console.log(person2);
