import * as _ from "lodash";

export const isValid = (val: any) => !_.isUndefined(val) && !_.isNull(val);
