"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var graphql_request_1 = require("graphql-request");
var UNISWAP = require("./dex_queries/uniswap");
var SUSHISWAP = require("./dex_queries/sushiswap");
var Graph_1 = require("./graph_library/Graph");
var GraphVertex_1 = require("./graph_library/GraphVertex");
var GraphEdge_1 = require("./graph_library/GraphEdge");
var bellman_ford_1 = require("./bellman-ford");
var constants_1 = require("./constants");
// Fetch most active tokens 
function fetchTokens(first, skip, dex) {
    if (skip === void 0) { skip = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var dexEndpoint, tokensQuery, mostActiveTokens;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dexEndpoint = (dex === constants_1.DEX.UniswapV3) ? UNISWAP.ENDPOINT : SUSHISWAP.ENDPOINT;
                    tokensQuery = (dex === constants_1.DEX.UniswapV3) ? UNISWAP.HIGHEST_VOLUME_TOKENS(first) : SUSHISWAP.HIGHEST_VOLUME_TOKENS(first, skip);
                    return [4 /*yield*/, graphql_request_1.request(dexEndpoint, tokensQuery)];
                case 1:
                    mostActiveTokens = _a.sent();
                    console.log("Tokens:", mostActiveTokens.tokens);
                    return [2 /*return*/, mostActiveTokens.tokens.map(function (t) { return t.id; })];
            }
        });
    });
}
function calculatePathWeight(g, cycle) {
    var cycleWeight = 1.0;
    // console.log(cycle.length);
    for (var index = 0; index < cycle.length - 1; index++) {
        var indexNext = index + 1;
        // console.log(`new indices: ${index} ${indexNext}`);
        var startVertex = g.getVertexByKey(cycle[index]);
        var endVertex = g.getVertexByKey(cycle[indexNext]);
        var edge = g.findEdge(startVertex, endVertex);
        // console.log(`Start: ${startVertex.value} | End: ${endVertex.value}`)
        // console.log(`Adj edge weight: ${edge.weight} | Raw edge weight: ${edge.rawWeight} | ${edge.getKey()}`);
        // console.log(`DEX: ${edge.metadata.dex}`)
        // console.log(cycleWeight * edge.rawWeight)
        cycleWeight *= edge.rawWeight;
    }
    return cycleWeight;
}
function fetchUniswapPools(tokenIds) {
    return __awaiter(this, void 0, void 0, function () {
        var pools, tokenIdsSet, _i, tokenIds_1, id, whitelistPoolsRaw, whitelistPools, _a, whitelistPools_1, pool, otherToken;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pools = new Set();
                    tokenIdsSet = new Set(tokenIds);
                    _i = 0, tokenIds_1 = tokenIds;
                    _b.label = 1;
                case 1:
                    if (!(_i < tokenIds_1.length)) return [3 /*break*/, 4];
                    id = tokenIds_1[_i];
                    return [4 /*yield*/, graphql_request_1.request(UNISWAP.ENDPOINT, UNISWAP.token_whitelist_pools(id))];
                case 2:
                    whitelistPoolsRaw = _b.sent();
                    whitelistPools = whitelistPoolsRaw.token.whitelistPools;
                    // Filter to only
                    for (_a = 0, whitelistPools_1 = whitelistPools; _a < whitelistPools_1.length; _a++) {
                        pool = whitelistPools_1[_a];
                        otherToken = (pool.token0.id === id) ? pool.token1.id : pool.token0.id;
                        if (tokenIdsSet.has(otherToken)) {
                            pools.add(pool.id);
                        }
                    }
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, pools];
            }
        });
    });
}
function fetchSushiswapPools(tokenIds) {
    return __awaiter(this, void 0, void 0, function () {
        var pools, poolsDataRaw, poolsData, _i, poolsData_1, pool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pools = new Set();
                    return [4 /*yield*/, graphql_request_1.request(SUSHISWAP.ENDPOINT, SUSHISWAP.PAIRS(tokenIds))];
                case 1:
                    poolsDataRaw = _a.sent();
                    poolsData = poolsDataRaw.pairs;
                    // Filter to only
                    for (_i = 0, poolsData_1 = poolsData; _i < poolsData_1.length; _i++) {
                        pool = poolsData_1[_i];
                        pools.add(pool.id);
                    }
                    return [2 /*return*/, pools];
            }
        });
    });
}
// Fetch prices
function fetchPoolPrices(g, pools, dex, debug) {
    if (debug === void 0) { debug = false; }
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, pool, DEX_ENDPOINT, DEX_QUERY, poolRequest, poolData, reserves, vertex0, vertex1, token1Price, token0Price, forwardEdge, backwardEdge, forwardEdgeExists, backwardEdgeExists;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (debug)
                        console.log(pools);
                    _i = 0, _a = Array.from(pools.values());
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    pool = _a[_i];
                    if (debug)
                        console.log(dex, pool); //debug
                    DEX_ENDPOINT = (dex === constants_1.DEX.UniswapV3) ? UNISWAP.ENDPOINT :
                        (dex === constants_1.DEX.Sushiswap) ? SUSHISWAP.ENDPOINT : "";
                    DEX_QUERY = (dex === constants_1.DEX.UniswapV3) ? UNISWAP.fetch_pool(pool) :
                        (dex === constants_1.DEX.Sushiswap) ? SUSHISWAP.PAIR(pool) : "";
                    return [4 /*yield*/, graphql_request_1.request(DEX_ENDPOINT, DEX_QUERY)];
                case 2:
                    poolRequest = _b.sent();
                    poolData = (dex === constants_1.DEX.UniswapV3) ? poolRequest.pool :
                        (dex === constants_1.DEX.Sushiswap) ? poolRequest.pair : [];
                    if (debug)
                        console.log(poolData); //debug
                    reserves = (dex === constants_1.DEX.UniswapV3) ? Number(poolData.totalValueLockedUSD) :
                        (dex === constants_1.DEX.Sushiswap) ? Number(poolData.reserveUSD) : 0;
                    if (poolData.token1Price != 0 && poolData.token0Price != 0 && reserves > constants_1.MIN_TVL) {
                        vertex0 = g.getVertexByKey(poolData.token0.id);
                        vertex1 = g.getVertexByKey(poolData.token1.id);
                        token1Price = Number(poolData.token1Price);
                        token0Price = Number(poolData.token0Price);
                        forwardEdge = new GraphEdge_1.default(vertex0, vertex1, -Math.log(Number(token1Price)), token1Price, { dex: dex, address: pool });
                        backwardEdge = new GraphEdge_1.default(vertex1, vertex0, -Math.log(Number(token0Price)), token0Price, { dex: dex, address: pool });
                        forwardEdgeExists = g.findEdge(vertex0, vertex1);
                        backwardEdgeExists = g.findEdge(vertex1, vertex0);
                        if (forwardEdgeExists) {
                            if (forwardEdgeExists.rawWeight < forwardEdge.rawWeight) {
                                if (debug)
                                    console.log("replacing: " + poolData.token0.symbol + "->" + poolData.token1.symbol + " from " + forwardEdgeExists.rawWeight + " to " + forwardEdge.rawWeight);
                                g.deleteEdge(forwardEdgeExists);
                                g.addEdge(forwardEdge);
                            }
                        }
                        else {
                            g.addEdge(forwardEdge);
                        }
                        if (backwardEdgeExists) {
                            if (backwardEdgeExists.rawWeight < backwardEdge.rawWeight) {
                                if (debug)
                                    console.log("replacing: " + poolData.token1.symbol + "->" + poolData.token0.symbol + " from " + backwardEdgeExists.rawWeight + " to " + backwardEdge.rawWeight);
                                g.deleteEdge(backwardEdgeExists);
                                g.addEdge(backwardEdge);
                            }
                        }
                        else {
                            g.addEdge(backwardEdge);
                        }
                    }
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Calculates all arbitrage cycles in given graph
 * @param {*} g - graph
 * @returns array of cycles & negative cycle value
 */
function calcArbitrage(g) {
    return __awaiter(this, void 0, void 0, function () {
        var arbitrageData, uniqueCycle;
        return __generator(this, function (_a) {
            arbitrageData = [];
            uniqueCycle = {};
            g.getAllVertices().forEach(function (vertex) {
                var result = bellman_ford_1.default(g, vertex);
                console.log(result);
                var cyclePaths = result.cyclePaths;
                for (var _i = 0, cyclePaths_1 = cyclePaths; _i < cyclePaths_1.length; _i++) {
                    var cycle = cyclePaths_1[_i];
                    var pools = [];
                    var prev = '';
                    for (var _a = 0, cycle_1 = cycle; _a < cycle_1.length; _a++) {
                        var c = cycle_1[_a];
                        if (prev != '') {
                            pools.push(g.findEdge(g.getVertexByKey(prev), g.getVertexByKey(c)).metadata.address);
                        }
                        prev = c;
                    }
                    var cycleString = cycle.join('');
                    var cycleWeight = calculatePathWeight(g, cycle);
                    if (!uniqueCycle[cycleString]) {
                        uniqueCycle[cycleString] = true;
                        arbitrageData.push({ cycle: cycle, cycleWeight: cycleWeight, pools: pools });
                    }
                }
            });
            return [2 /*return*/, arbitrageData];
        });
    });
}
function main(numberTokens, DEXs, debug) {
    if (numberTokens === void 0) { numberTokens = 5; }
    if (debug === void 0) { debug = false; }
    return __awaiter(this, void 0, void 0, function () {
        var g, defaultDex, tokenIds, uniPools, sushiPools, arbitrageData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    g = new Graph_1.default(true);
                    defaultDex = (DEXs.size === 1 && DEXs.has(constants_1.DEX.Sushiswap)) ? constants_1.DEX.Sushiswap :
                        (DEXs.size === 1 && DEXs.has(constants_1.DEX.UniswapV3)) ? constants_1.DEX.UniswapV3 : constants_1.DEX.UniswapV3;
                    return [4 /*yield*/, fetchTokens(numberTokens, 0, defaultDex)];
                case 1:
                    tokenIds = _a.sent();
                    tokenIds.forEach(function (element) {
                        g.addVertex(new GraphVertex_1.default(element));
                    });
                    if (!DEXs.has(constants_1.DEX.UniswapV3)) return [3 /*break*/, 4];
                    return [4 /*yield*/, fetchUniswapPools(tokenIds)];
                case 2:
                    uniPools = _a.sent();
                    return [4 /*yield*/, fetchPoolPrices(g, uniPools, constants_1.DEX.UniswapV3, debug)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (!DEXs.has(constants_1.DEX.Sushiswap)) return [3 /*break*/, 7];
                    return [4 /*yield*/, fetchSushiswapPools(tokenIds)];
                case 5:
                    sushiPools = _a.sent();
                    return [4 /*yield*/, fetchPoolPrices(g, sushiPools, constants_1.DEX.Sushiswap, debug)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [4 /*yield*/, calcArbitrage(g)];
                case 8:
                    arbitrageData = _a.sent();
                    console.log("Cycles:", arbitrageData);
                    console.log("There were " + arbitrageData.length + " arbitrage cycles detected.");
                    // printGraphEdges(g);
                    return [2 /*return*/, arbitrageData];
            }
        });
    });
}
exports.main = main;
// debugging stuff
function printGraphEdges(g) {
    var edges = g.getAllEdges();
    for (var _i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
        var edge = edges_1[_i];
        console.log(edge.startVertex + " -> " + edge.endVertex + " | " + edge.rawWeight + " | DEX: " + edge.metadata.dex);
    }
}
