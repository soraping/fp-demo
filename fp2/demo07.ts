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

let newArr = map<string>(arr, (item, index, arr) => {
  return item + " haha";
});

console.log(newArr);
