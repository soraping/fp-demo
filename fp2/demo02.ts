class Person {
  constructor(public name: string, public country: string) {}
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

console.log(result);

let selectorHOC = (student: Student) => {
  return (friend: Student) => {
    return friend.country == student.country && friend.school == student.school;
  };
};

let findStudent = (students: Student[], selector) => {
  return students.filter(selector);
};

let result2 = findStudent([zhagnsan, lisi, lucy, jim], selectorHOC(tom));

console.log(result2);
