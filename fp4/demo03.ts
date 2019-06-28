import { throwError, defer } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, catchError, pluck, take, first } from "rxjs/operators";
import { XMLHttpRequest } from "xmlhttprequest";
import * as _ from "lodash";
import * as path from "path";
import * as fs from "fs";
import xlsx from "node-xlsx";

const createXHR = function() {
  return new XMLHttpRequest();
};

const observableFactory = () =>
  ajax({
    createXHR,
    crossDomain: true,
    method: "post",
    responseType: "text",
    url: "http://d2c-api.1000.com/chain-store/list",
    body: {},
    headers: {
      Authorization: "ff8dadfc1e8d4f2fa1fcc537919d458e",
      systemId: "0031",
      Platform: "pc",
      "Content-Type": "application/json"
    }
  });

const source$ = defer(observableFactory);

source$
  .pipe(map(userResponse => JSON.parse(userResponse.response)["data"]))
  .subscribe(
    res => {
      let shopList = _.chain(res)
        .map(item => {
          return [
            item["shopId"],
            item["storeName"],
            item["regNickName"] == "TakeReg" ? "直营" : "加盟"
          ];
        })
        .value();
      let setting = { savePath: "./" };
      let name = "1.xlsx";
      let filePath = path.resolve(setting.savePath, name);

      let data = [
        {
          name: "sheet1",
          data: shopList
        }
      ];
      var bufferData = xlsx.build(data);
      fs.writeFile(filePath, bufferData, function(err) {});
    },
    e => console.error(e)
  );
