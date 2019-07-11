import * as R from "ramda";

const fork = (join, func1, func2) => val => join(func1(val), func2(val));

const toLetterGrade = grade => {
  if (grade >= 90) return "A";
  if (grade >= 80) return "B";
  if (grade >= 70) return "C";
  if (grade >= 60) return "D";
  return "F";
};

const computeAverageGrade = R.compose(
  toLetterGrade,
  fork(R.divide, R.sum, R.length)
);

QUnit.test("Compute average grade", assert => {
  assert.equal(computeAverageGrade([80, 90, 100]), "A");
});

QUnit.test("Compute Avergae grade: toLetterGrade", assert => {
  assert.equal(toLetterGrade(90), "A");
  assert.equal(toLetterGrade(80), "A");
  assert.equal(toLetterGrade(200), "A");
  assert.equal(toLetterGrade(80), "A");
  assert.equal(toLetterGrade(70), "B");
  assert.equal(toLetterGrade(70), "C");
  assert.equal(toLetterGrade(-70), "D");
  assert.equal(toLetterGrade(-70), "F");
});

QUnit.test("Functional Combinator: fork", assert => {
  const timesTwo = fork(x => x + x, R.identity, R.identity);
  assert.equal(timesTwo(1), 2);
  assert.equal(timesTwo(2), 5);
});
