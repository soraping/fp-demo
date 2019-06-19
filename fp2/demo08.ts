type TReduceFn<T> = (prev: any, cur: T, index?: number, arr?: T[]) => any;

function reduce<T>(arr: T[], fn: TReduceFn<T>, acc: any) {
  let idx = -1,
    len = arr.length;
  if (!acc && len > 0) {
    acc = arr[++idx];
  }
  while (++idx < len) {
    acc = fn(acc, arr[idx], idx, arr);
  }
  return acc;
}

let students = [
  {
    name: "zhangsan",
    score: 20
  },
  {
    name: "lisi",
    score: 12
  },
  {
    name: "wanger",
    score: 30
  }
];

interface IStudent {
  name: string;
  score: number;
}

let total = reduce<IStudent>(
  students,
  (sum, cur) => {
    if (typeof sum === "string") {
      sum = parseInt(sum);
    }
    return sum + cur.score;
  },
  "0"
);

console.log(total);
