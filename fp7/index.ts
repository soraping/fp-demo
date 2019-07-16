import * as R from "ramda";

/**
 * 通过递归，获取数组中字符最长的一个
 * @param str 当前字符
 * @param arr 目标数组
 */
function longest(str: string, arr: string[]): string {
  if (R.isEmpty(arr)) {
    return str;
  } else {
    let currentStr = R.head(arr).length >= str.length ? R.head(arr) : str;
    return longest(currentStr, R.tail(arr));
  }
}
