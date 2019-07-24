import "../helper/memoize";

const factorial = n => (n === 0 ? 1 : n * factorial(n - 1));
const m_factorial = factorial.memoize();

console.time("factorial(100)");
console.log(m_factorial(100));
console.timeEnd("factorial(100)");
console.time("factorial(101)");
console.log(m_factorial(101));
console.timeEnd("factorial(101)");
