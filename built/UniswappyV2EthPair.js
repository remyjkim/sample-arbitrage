"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.UniswappyV2EthPair = void 0;
var _ = require("lodash");
var ethers_1 = require("ethers");
var abi_1 = require("./abi");
var addresses_1 = require("./addresses");
var EthMarket_1 = require("./EthMarket");
var utils_1 = require("./utils");
// batch count limit helpful for testing, loading entire set of uniswap markets takes a long time to load
var BATCH_COUNT_LIMIT = 100;
var UNISWAP_BATCH_SIZE = 1000;
// Not necessary, slightly speeds up loading initialization when we know tokens are bad
// Estimate gas will ensure we aren't submitting bad bundles, but bad tokens waste time
var blacklistTokens = [
    '0xD75EA151a61d06868E31F8988D28DFE5E9df57B4'
];
// TODO: needs to be changed
var UniswappyV2EthPair = /** @class */ (function (_super) {
    __extends(UniswappyV2EthPair, _super);
    function UniswappyV2EthPair(marketAddress, tokens, protocol) {
        var _this = _super.call(this, marketAddress, tokens, protocol) || this;
        _this._tokenBalances = _.zipObject(tokens, [ethers_1.BigNumber.from(0), ethers_1.BigNumber.from(0)]);
        return _this;
    }
    UniswappyV2EthPair.prototype.receiveDirectly = function (tokenAddress) {
        return tokenAddress in this._tokenBalances;
    };
    UniswappyV2EthPair.prototype.prepareReceive = function (tokenAddress, amountIn) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this._tokenBalances[tokenAddress] === undefined) {
                    throw new Error("Market does not operate on token " + tokenAddress);
                }
                if (!amountIn.gt(0)) {
                    throw new Error("Invalid amount: " + amountIn.toString());
                }
                // No preparation necessary
                return [2 /*return*/, []];
            });
        });
    };
    UniswappyV2EthPair.getUniswappyMarkets = function (provider, factoryAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var uniswapQuery, marketPairs, i, pairs, i_1, pair, marketAddress, tokenAddress, uniswappyV2EthPair;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uniswapQuery = new ethers_1.Contract(addresses_1.UNISWAP_LOOKUP_CONTRACT_ADDRESS, abi_1.UNISWAP_QUERY_ABI, provider);
                        marketPairs = new Array();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < BATCH_COUNT_LIMIT * UNISWAP_BATCH_SIZE)) return [3 /*break*/, 4];
                        return [4 /*yield*/, uniswapQuery.functions.getPairsByIndexRange(factoryAddress, i, i + UNISWAP_BATCH_SIZE)];
                    case 2:
                        pairs = (_a.sent())[0];
                        for (i_1 = 0; i_1 < pairs.length; i_1++) {
                            pair = pairs[i_1];
                            marketAddress = pair[2];
                            tokenAddress = void 0;
                            if (pair[0] === addresses_1.WETH_ADDRESS) {
                                tokenAddress = pair[1];
                            }
                            else if (pair[1] === addresses_1.WETH_ADDRESS) {
                                tokenAddress = pair[0];
                            }
                            else {
                                continue;
                            }
                            if (!blacklistTokens.includes(tokenAddress)) {
                                uniswappyV2EthPair = new UniswappyV2EthPair(marketAddress, [pair[0], pair[1]], "");
                                marketPairs.push(uniswappyV2EthPair);
                            }
                        }
                        if (pairs.length < UNISWAP_BATCH_SIZE) {
                            return [3 /*break*/, 4];
                        }
                        _a.label = 3;
                    case 3:
                        i += UNISWAP_BATCH_SIZE;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, marketPairs];
                }
            });
        });
    };
    UniswappyV2EthPair.getUniswapMarketsByToken = function (provider, factoryAddresses) {
        return __awaiter(this, void 0, void 0, function () {
            var allPairs, marketsByTokenAll, allMarketPairs, marketsByToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(_.map(factoryAddresses, function (factoryAddress) { return UniswappyV2EthPair.getUniswappyMarkets(provider, factoryAddress); }))];
                    case 1:
                        allPairs = _a.sent();
                        marketsByTokenAll = _.chain(allPairs)
                            .flatten()
                            .groupBy(function (pair) { return pair.tokens[0] === addresses_1.WETH_ADDRESS ? pair.tokens[1] : pair.tokens[0]; })
                            .value();
                        allMarketPairs = _.chain(_.pickBy(marketsByTokenAll, function (a) { return a.length > 1; }) // weird TS bug, chain'd pickBy is Partial<>
                        )
                            .values()
                            .flatten()
                            .value();
                        return [4 /*yield*/, UniswappyV2EthPair.updateReserves(provider, allMarketPairs)];
                    case 2:
                        _a.sent();
                        marketsByToken = _.chain(allMarketPairs)
                            .filter(function (pair) { return (pair.getBalance(addresses_1.WETH_ADDRESS).gt(utils_1.ETHER)); })
                            .groupBy(function (pair) { return pair.tokens[0] === addresses_1.WETH_ADDRESS ? pair.tokens[1] : pair.tokens[0]; })
                            .value();
                        return [2 /*return*/, {
                                marketsByToken: marketsByToken,
                                allMarketPairs: allMarketPairs
                            }];
                }
            });
        });
    };
    UniswappyV2EthPair.updateReserves = function (provider, allMarketPairs) {
        return __awaiter(this, void 0, void 0, function () {
            var uniswapQuery, pairAddresses, reserves, i, marketPair, reserve;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uniswapQuery = new ethers_1.Contract(addresses_1.UNISWAP_LOOKUP_CONTRACT_ADDRESS, abi_1.UNISWAP_QUERY_ABI, provider);
                        pairAddresses = allMarketPairs.map(function (marketPair) { return marketPair.marketAddress; });
                        console.log("Updating markets, count:", pairAddresses.length);
                        return [4 /*yield*/, uniswapQuery.functions.getReservesByPairs(pairAddresses)];
                    case 1:
                        reserves = (_a.sent())[0];
                        for (i = 0; i < allMarketPairs.length; i++) {
                            marketPair = allMarketPairs[i];
                            reserve = reserves[i];
                            marketPair.setReservesViaOrderedBalances([reserve[0], reserve[1]]);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UniswappyV2EthPair.prototype.getBalance = function (tokenAddress) {
        var balance = this._tokenBalances[tokenAddress];
        if (balance === undefined)
            throw new Error("bad token");
        return balance;
    };
    UniswappyV2EthPair.prototype.setReservesViaOrderedBalances = function (balances) {
        this.setReservesViaMatchingArray(this._tokens, balances);
    };
    UniswappyV2EthPair.prototype.setReservesViaMatchingArray = function (tokens, balances) {
        var tokenBalances = _.zipObject(tokens, balances);
        if (!_.isEqual(this._tokenBalances, tokenBalances)) {
            this._tokenBalances = tokenBalances;
        }
    };
    UniswappyV2EthPair.prototype.getTokensIn = function (tokenIn, tokenOut, amountOut) {
        var reserveIn = this._tokenBalances[tokenIn];
        var reserveOut = this._tokenBalances[tokenOut];
        return this.getAmountIn(reserveIn, reserveOut, amountOut);
    };
    UniswappyV2EthPair.prototype.getTokensOut = function (tokenIn, tokenOut, amountIn) {
        var reserveIn = this._tokenBalances[tokenIn];
        var reserveOut = this._tokenBalances[tokenOut];
        return this.getAmountOut(reserveIn, reserveOut, amountIn);
    };
    UniswappyV2EthPair.prototype.getAmountIn = function (reserveIn, reserveOut, amountOut) {
        var numerator = reserveIn.mul(amountOut).mul(1000);
        var denominator = reserveOut.sub(amountOut).mul(997);
        return numerator.div(denominator).add(1);
    };
    UniswappyV2EthPair.prototype.getAmountOut = function (reserveIn, reserveOut, amountIn) {
        var amountInWithFee = amountIn.mul(997);
        var numerator = amountInWithFee.mul(reserveOut);
        var denominator = reserveIn.mul(1000).add(amountInWithFee);
        return numerator.div(denominator);
    };
    UniswappyV2EthPair.prototype.sellTokensToNextMarket = function (tokenIn, amountIn, ethMarket) {
        return __awaiter(this, void 0, void 0, function () {
            var exchangeCall_1, exchangeCall;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(ethMarket.receiveDirectly(tokenIn) === true)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sellTokens(tokenIn, amountIn, ethMarket.marketAddress)];
                    case 1:
                        exchangeCall_1 = _a.sent();
                        return [2 /*return*/, {
                                data: [exchangeCall_1],
                                targets: [this.marketAddress]
                            }];
                    case 2: return [4 /*yield*/, this.sellTokens(tokenIn, amountIn, ethMarket.marketAddress)];
                    case 3:
                        exchangeCall = _a.sent();
                        return [2 /*return*/, {
                                data: [exchangeCall],
                                targets: [this.marketAddress]
                            }];
                }
            });
        });
    };
    UniswappyV2EthPair.prototype.sellTokens = function (tokenIn, amountIn, recipient) {
        return __awaiter(this, void 0, void 0, function () {
            var amount0Out, amount1Out, tokenOut, populatedTransaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amount0Out = ethers_1.BigNumber.from(0);
                        amount1Out = ethers_1.BigNumber.from(0);
                        if (tokenIn === this.tokens[0]) {
                            tokenOut = this.tokens[1];
                            amount1Out = this.getTokensOut(tokenIn, tokenOut, amountIn);
                        }
                        else if (tokenIn === this.tokens[1]) {
                            tokenOut = this.tokens[0];
                            amount0Out = this.getTokensOut(tokenIn, tokenOut, amountIn);
                        }
                        else {
                            throw new Error("Bad token input address");
                        }
                        return [4 /*yield*/, UniswappyV2EthPair.uniswapInterface.populateTransaction.swap(amount0Out, amount1Out, recipient, [])];
                    case 1:
                        populatedTransaction = _a.sent();
                        if (populatedTransaction === undefined || populatedTransaction.data === undefined)
                            throw new Error("HI");
                        return [2 /*return*/, populatedTransaction.data];
                }
            });
        });
    };
    UniswappyV2EthPair.uniswapInterface = new ethers_1.Contract(addresses_1.WETH_ADDRESS, abi_1.UNISWAP_PAIR_ABI);
    return UniswappyV2EthPair;
}(EthMarket_1.EthMarket));
exports.UniswappyV2EthPair = UniswappyV2EthPair;
