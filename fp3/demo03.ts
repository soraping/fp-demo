import * as _ from "lodash";

const Scheduler = (function() {
  const delayedFn = _.bind(setTimeout, undefined);
  return {
    delay5: _.partial(delayedFn, _, 5000),
    delay10: _.partial(delayedFn, _, 10000),
    delay15: _.partial(delayedFn, _, 15000)
  };
})();

Scheduler.delay5(() => {
  console.log("after 5 seconds!");
});
