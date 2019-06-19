console.log("start");

setTimeout(() => {
  console.log("settimeout1");
}, 1000);

new Promise(function(resolve, reject) {
  console.log("promise.resolve");
  setTimeout(() => {
    console.log("settimeout2");
  }, 200);
  resolve();
}).then(() => console.log("promise then"));

process.nextTick(() => console.log("process.nextTick"));

setTimeout(() => {
  console.log("settimeout3");
}, 0);

console.log("end");
