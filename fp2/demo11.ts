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

let newArr = filter<number>(arr, (value, index) => value > 3);

console.log(newArr);
