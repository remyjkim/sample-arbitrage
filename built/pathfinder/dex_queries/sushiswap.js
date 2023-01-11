"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HIGHEST_VOLUME_TOKENS = exports.PAIRS = exports.PAIR = exports.ENDPOINT = void 0;
var graphql_request_1 = require("graphql-request");
exports.ENDPOINT = "https://api.thegraph.com/subgraphs/name/sushiswap/exchange";
function PAIR(id) {
    return graphql_request_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      {\n        pair(id: \"", "\") {\n          token0 { id, symbol }\n          token1 { id, symbol }\n          token0Price\n          token1Price\n          reserveUSD\n        }\n      }\n    "], ["\n      {\n        pair(id: \"", "\") {\n          token0 { id, symbol }\n          token1 { id, symbol }\n          token0Price\n          token1Price\n          reserveUSD\n        }\n      }\n    "])), id);
}
exports.PAIR = PAIR;
function PAIRS(ids) {
    var idString = '[\"' + ids.join("\",\"") + "\"]";
    return graphql_request_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    query {\n        pairs (where: {\n            token0_in: ", ",\n            token1_in: ", "\n        },\n    ) {\n        id\n        name\n        token0 {id}\n        token1 {id}\n    }\n    }"], ["\n    query {\n        pairs (where: {\n            token0_in: ", ",\n            token1_in: ", "\n        },\n    ) {\n        id\n        name\n        token0 {id}\n        token1 {id}\n    }\n    }"])), idString, idString);
}
exports.PAIRS = PAIRS;
function HIGHEST_VOLUME_TOKENS(first, skip, orderby, orderDirection) {
    if (skip === void 0) { skip = 0; }
    if (orderby === void 0) { orderby = "volumeUSD"; }
    if (orderDirection === void 0) { orderDirection = "desc"; }
    return graphql_request_1.gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    {\n        tokens(first: ", ", skip: ", ", orderBy: ", ", orderDirection:", ") {\n          id\n          symbol\n          name\n        }\n    }"], ["\n    {\n        tokens(first: ", ", skip: ", ", orderBy: ", ", orderDirection:", ") {\n          id\n          symbol\n          name\n        }\n    }"])), first, skip, orderby, orderDirection);
}
exports.HIGHEST_VOLUME_TOKENS = HIGHEST_VOLUME_TOKENS;
var templateObject_1, templateObject_2, templateObject_3;
// TODO: Need function for fetching pools - no whitelisting concept like uniV3.
