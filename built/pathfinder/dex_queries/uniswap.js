"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.token_whitelist_pools = exports.fetch_pool = exports.HIGHEST_VOLUME_TOKENS = exports.POOLS = exports.ENDPOINT = void 0;
var graphql_request_1 = require("graphql-request");
/**
 * VARIABLES
 */
exports.ENDPOINT = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";
/**
 * QUERIES
 */
function POOLS(first, skip) {
    if (skip === void 0) { skip = 0; }
    graphql_request_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    {\n        pools(first:", ", skip: ", "){\n          id\n          token0 {\n            id\n            symbol\n          }\n          token1 {\n            id\n            symbol\n          }\n        }\n      }\n    "], ["\n    {\n        pools(first:", ", skip: ", "){\n          id\n          token0 {\n            id\n            symbol\n          }\n          token1 {\n            id\n            symbol\n          }\n        }\n      }\n    "])), first, skip);
}
exports.POOLS = POOLS;
function HIGHEST_VOLUME_TOKENS(first, skip, orderby, orderDirection) {
    if (skip === void 0) { skip = 0; }
    if (orderby === void 0) { orderby = "volumeUSD"; }
    if (orderDirection === void 0) { orderDirection = "desc"; }
    return graphql_request_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    {\n        tokens(first: ", ", skip: ", ", orderBy: ", ", orderDirection:", ") {\n          id\n          symbol\n          name\n        }\n    }"], ["\n    {\n        tokens(first: ", ", skip: ", ", orderBy: ", ", orderDirection:", ") {\n          id\n          symbol\n          name\n        }\n    }"])), first, skip, orderby, orderDirection);
}
exports.HIGHEST_VOLUME_TOKENS = HIGHEST_VOLUME_TOKENS;
function fetch_pool(id) {
    return graphql_request_1.gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    {\n      pool(id: \"", "\") {\n        token0 { id, symbol }\n        token1 { id, symbol }\n        token0Price\n        token1Price\n        totalValueLockedUSD\n      }\n    }\n  "], ["\n    {\n      pool(id: \"", "\") {\n        token0 { id, symbol }\n        token1 { id, symbol }\n        token0Price\n        token1Price\n        totalValueLockedUSD\n      }\n    }\n  "])), id);
}
exports.fetch_pool = fetch_pool;
function token_whitelist_pools(id) {
    return graphql_request_1.gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    {\n      token(id: \"", "\") {\n        whitelistPools {\n          id\n          token0 {\n            id\n          }\n          token1 {\n            id\n          }\n        }\n      }\n    }\n  "], ["\n    {\n      token(id: \"", "\") {\n        whitelistPools {\n          id\n          token0 {\n            id\n          }\n          token1 {\n            id\n          }\n        }\n      }\n    }\n  "])), id);
}
exports.token_whitelist_pools = token_whitelist_pools;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
