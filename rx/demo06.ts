import { throwError, defer } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, catchError } from "rxjs/operators";
import { XMLHttpRequest } from "xmlhttprequest";

const createXHR = function() {
  return new XMLHttpRequest();
};

const observableFactory = () =>
  ajax({
    createXHR,
    crossDomain: true,
    method: "get",
    responseType: "text",
    url:
      "http://qianmi-web.oss-cn-hangzhou.aliyuncs.com/x-site/prod/public/barRepo/x-site-ui/widget-bar/search-bar/demo1/search-demo1-logo.js"
  });

const source$ = defer(observableFactory);

source$
  .pipe(
    map(userResponse => userResponse.response),
    catchError(error => throwError(error))
  )
  .subscribe(console.log, e => console.error(e), () => console.log("complete"));
