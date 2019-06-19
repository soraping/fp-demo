var myModule = (function module() {
  let _myPrivate = "123";
  let method1 = function() {
    console.log("method111");
    console.log(_myPrivate);
  };

  let method2 = function() {
    console.log("method222");
  };

  return {
    method1,
    method2
  };
})();

myModule.method1();
