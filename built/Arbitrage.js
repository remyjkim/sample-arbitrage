"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.Arbitrage = exports.getBestCrossedMarket = void 0;
var _ = require("lodash");
var ethers_1 = require("ethers");
var utils_1 = require("./utils");
var UniswappyV2EthPair_1 = require("./UniswappyV2EthPair");
// TODO: implement binary search (assuming linear/exponential global maximum profitability)
var decimals = 18;
var TEST_VOLUMES = [
    // ETHER.div(100),
    // ETHER.div(10),
    // ETHER.div(6),
    // ETHER.div(4),
    // ETHER.div(2),
    // ETHER.div(1),
    // ETHER.mul(2),
    // ETHER.mul(5),
    // ETHER.mul(10),
    //   BigNumber.from(10**20),
    // BigNumber.from(10**19),
    ethers_1.BigNumber.from(10).pow(decimals + 2),
    ethers_1.BigNumber.from(10).pow(decimals + 1),
    ethers_1.BigNumber.from(10).pow(decimals),
    ethers_1.BigNumber.from(10).pow(decimals - 1),
];
function getBestCrossedMarket(arbitrageData) {
    // let bestCrossedMarket: CrossedMarketDetails | undefined = undefined;
    // for (const crossedMarket of arbitrageData) {
    var bestCrossedMarkets = [];
    for (var _i = 0, arbitrageData_1 = arbitrageData; _i < arbitrageData_1.length; _i++) {
        var bestCrossedMarket = arbitrageData_1[_i];
        // console.log("Send this much WETH", bestCrossedMarket.volume.toString(), "get this much profit", bestCrossedMarket.profit.toString())
        // const inter = bestCrossedMarket.volume
        //
        // }
        // const sellToMarket = crossedMarket[0]
        // const buyFromMarket = crossedMarket[1]
        var profits = [];
        for (var _a = 0, TEST_VOLUMES_1 = TEST_VOLUMES; _a < TEST_VOLUMES_1.length; _a++) {
            var size = TEST_VOLUMES_1[_a];
            var temp_size = size;
            for (var i = 0; i < bestCrossedMarket.pools.length - 1; i++) {
                // const buyCalls = bestCrossedMarket.pools[i].getTokensOut(bestCrossedMarket.cycle[i], temp_size, bestCrossedMarket.pools[i+1]);
                temp_size = bestCrossedMarket.pools[i].getTokensOut(bestCrossedMarket.cycle[i], bestCrossedMarket.cycle[i + 1], ethers_1.BigNumber.from(temp_size));
            }
            // const tokensOutFromBuyingSize = buyFromMarket.getTokensOut(WETH_ADDRESS, tokenAddress, size);
            var l = bestCrossedMarket.pools.length;
            var proceedsFromSellingTokens = bestCrossedMarket.pools[l - 1].getTokensOut(bestCrossedMarket.cycle[l - 1], bestCrossedMarket.cycle[l], ethers_1.BigNumber.from(temp_size));
            var profit = proceedsFromSellingTokens.sub(size);
            profits.push(profit);
            // const maxProfit = Math.max(profits)
            var maxProfit = profits.reduce(function (a, b) { return Math.max(a, b); }, -Infinity);
            var bestMarket = {
                volume: TEST_VOLUMES[profits.indexOf(maxProfit)],
                profit: maxProfit,
                tokenAddress: bestCrossedMarket.cycle,
                poolAddress: bestCrossedMarket.pools
            };
            bestCrossedMarkets.push(bestMarket);
        }
    }
    return bestCrossedMarkets;
}
exports.getBestCrossedMarket = getBestCrossedMarket;
var Arbitrage = /** @class */ (function () {
    function Arbitrage(executorWallet, flashbotsProvider, bundleExecutorContract) {
        this.executorWallet = executorWallet;
        this.flashbotsProvider = flashbotsProvider;
        this.bundleExecutorContract = bundleExecutorContract;
    }
    // static printCrossedMarket(crossedMarket: CrossedMarketDetails): void {
    //   const buyTokens = crossedMarket.buyFromMarket.tokens
    //   const sellTokens = crossedMarket.sellToMarket.tokens
    //   console.log(
    //     `Profit: ${bigNumberToDecimal(crossedMarket.profit)} Volume: ${bigNumberToDecimal(crossedMarket.volume)}\n` +
    //     `${crossedMarket.buyFromMarket.protocol} (${crossedMarket.buyFromMarket.marketAddress})\n` +
    //     `  ${buyTokens[0]} => ${buyTokens[1]}\n` +
    //     `${crossedMarket.sellToMarket.protocol} (${crossedMarket.sellToMarket.marketAddress})\n` +
    //     `  ${sellTokens[0]} => ${sellTokens[1]}\n` +
    //     `\n`
    //   )
    // }
    // async evaluateMarkets(marketsByToken: MarketsByToken): Promise<Array<CrossedMarketDetails>> {
    //   const bestCrossedMarkets = new Array<CrossedMarketDetails>()
    //
    //   for (const tokenAddress in marketsByToken) {
    //     const markets = marketsByToken[tokenAddress]
    //     const pricedMarkets = _.map(markets, (ethMarket: EthMarket) => {
    //       return {
    //         ethMarket: ethMarket,
    //         buyTokenPrice: ethMarket.getTokensIn(tokenAddress, WETH_ADDRESS, ETHER.div(100)),
    //         sellTokenPrice: ethMarket.getTokensOut(WETH_ADDRESS, tokenAddress, ETHER.div(100)),
    //       }
    //     });
    //
    //     const crossedMarkets = new Array<Array<EthMarket>>()
    //     for (const pricedMarket of pricedMarkets) {
    //       _.forEach(pricedMarkets, pm => {
    //         if (pm.sellTokenPrice.gt(pricedMarket.buyTokenPrice)) {
    //           crossedMarkets.push([pricedMarket.ethMarket, pm.ethMarket])
    //         }
    //       })
    //     }
    //
    //     const bestCrossedMarket = getBestCrossedMarket(arbitrageData);
    //     if (bestCrossedMarket !== undefined && bestCrossedMarket.profit.gt(ETHER.div(1000))) {
    //       bestCrossedMarkets.push(bestCrossedMarket)
    //     }
    //   }
    //   bestCrossedMarkets.sort((a, b) => a.profit.lt(b.profit) ? 1 : a.profit.gt(b.profit) ? -1 : 0)
    //   return bestCrossedMarkets
    // }
    // TODO: take more than 1
    Arbitrage.prototype.takeCrossedMarkets = function (blockNumber, minerRewardPercentage, arbitrageDataRaw) {
        return __awaiter(this, void 0, void 0, function () {
            var pools_, i, arb, _i, _a, pool, arbitrageData, _loop_1, this_1, _b, arbitrageData_2, bestCrossedMarket, state_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        pools_ = [];
                        for (i = 0; i < arbitrageDataRaw.length; i++) {
                            arb = arbitrageDataRaw[i];
                            for (_i = 0, _a = arb.pools; _i < _a.length; _i++) {
                                pool = _a[_i];
                                pools_.push(new UniswappyV2EthPair_1.UniswappyV2EthPair(pool, ["", ""], ""));
                            }
                            arbitrageDataRaw[i].pools = pools_;
                        }
                        arbitrageData = getBestCrossedMarket(arbitrageDataRaw);
                        _loop_1 = function (bestCrossedMarket) {
                            var targets, payloads, inter, i, buyCalls, inter_1, sellCallData, minerReward, transaction, estimateGas, e_1, bundledTransactions, signedBundle, simulation, bundlePromises;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        targets = new Array();
                                        payloads = new Array();
                                        console.log("Send this much WETH", bestCrossedMarket.volume.toString(), "get this much profit", bestCrossedMarket.profit.toString());
                                        inter = bestCrossedMarket.volume;
                                        i = 0;
                                        _a.label = 1;
                                    case 1:
                                        if (!(i < bestCrossedMarket.poolAddress.length - 1)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, bestCrossedMarket.poolAddress[i].sellTokensToNextMarket(bestCrossedMarket.tokenAddress[i], bestCrossedMarket.volume, bestCrossedMarket.poolAddress[i + 1])];
                                    case 2:
                                        buyCalls = _a.sent();
                                        inter_1 = bestCrossedMarket.poolAddress[i].getTokensOut(bestCrossedMarket.tokenAddress[i], bestCrossedMarket.tokenAddress[i + 1], bestCrossedMarket.volume);
                                        targets.push(buyCalls.targets[0]);
                                        payloads.push(buyCalls.data[0]);
                                        _a.label = 3;
                                    case 3:
                                        i++;
                                        return [3 /*break*/, 1];
                                    case 4: return [4 /*yield*/, bestCrossedMarket.poolAddress[bestCrossedMarket.poolAddress.length - 1]
                                            .sellTokens(bestCrossedMarket.tokenAddress[bestCrossedMarket.tokenAddress.length - 2], inter, this_1.bundleExecutorContract.address)];
                                    case 5:
                                        sellCallData = _a.sent();
                                        targets.push(String(bestCrossedMarket.poolAddress[bestCrossedMarket.poolAddress.length - 1]));
                                        payloads.push(sellCallData);
                                        // console.log(sellCallData)
                                        // const targets: Array<string> = [...buyCalls.targets, bestCrossedMarket.sellToMarket.marketAddress]
                                        // const payloads: Array<string> = [...buyCalls.data, sellCallData]
                                        console.log({ targets: targets, payloads: payloads });
                                        minerReward = bestCrossedMarket.profit.mul(minerRewardPercentage).div(100);
                                        return [4 /*yield*/, this_1.bundleExecutorContract.populateTransaction.uniswapERC20(bestCrossedMarket.tokenAddress, bestCrossedMarket.volume, minerReward, targets, payloads, {
                                                // gasPrice: BigNumber.from(5000000000),
                                                gasLimit: ethers_1.BigNumber.from(20000000),
                                            })];
                                    case 6:
                                        transaction = _a.sent();
                                        _a.label = 7;
                                    case 7:
                                        _a.trys.push([7, 9, , 10]);
                                        return [4 /*yield*/, this_1.bundleExecutorContract.provider.estimateGas(__assign(__assign({}, transaction), { from: this_1.executorWallet.address, maxFeePerGas: ethers_1.ethers.utils.parseUnits('10', 'gwei') }))];
                                    case 8:
                                        estimateGas = _a.sent();
                                        if (estimateGas.gt(1400000)) {
                                            console.log("EstimateGas succeeded, but suspiciously large: " + estimateGas.toString());
                                            return [2 /*return*/, "continue"];
                                        }
                                        transaction.gasLimit = estimateGas.mul(2);
                                        return [3 /*break*/, 10];
                                    case 9:
                                        e_1 = _a.sent();
                                        console.log(e_1);
                                        // console.log(provider.get)
                                        console.warn("Estimate gas failure for " + JSON.stringify(bestCrossedMarket));
                                        return [2 /*return*/, "continue"];
                                    case 10:
                                        bundledTransactions = [
                                            // you can just plug in new txs from mempool and add new txs to the front and behiind
                                            {
                                                signer: this_1.executorWallet,
                                                transaction: transaction
                                            }
                                        ];
                                        console.log(bundledTransactions);
                                        return [4 /*yield*/, this_1.flashbotsProvider.signBundle(bundledTransactions)
                                            //
                                        ];
                                    case 11:
                                        signedBundle = _a.sent();
                                        return [4 /*yield*/, this_1.flashbotsProvider.simulate(signedBundle, blockNumber + 1)];
                                    case 12:
                                        simulation = _a.sent();
                                        if ("error" in simulation || simulation.firstRevert !== undefined) {
                                            console.log("Simulation Error on token " + bestCrossedMarket.tokenAddress + ", skipping");
                                            return [2 /*return*/, "continue"];
                                        }
                                        console.log("Submitting bundle, profit sent to miner: " + utils_1.bigNumberToDecimal(simulation.coinbaseDiff) + ", effective gas price: " + utils_1.bigNumberToDecimal(simulation.coinbaseDiff.div(simulation.totalGasUsed), 9) + " GWEI");
                                        bundlePromises = _.map([blockNumber + 1, blockNumber + 2], function (targetBlockNumber) {
                                            return _this.flashbotsProvider.sendRawBundle(signedBundle, targetBlockNumber);
                                        });
                                        return [4 /*yield*/, Promise.all(bundlePromises)];
                                    case 13:
                                        _a.sent();
                                        return [2 /*return*/, { value: void 0 }];
                                }
                            });
                        };
                        this_1 = this;
                        _b = 0, arbitrageData_2 = arbitrageData;
                        _c.label = 1;
                    case 1:
                        if (!(_b < arbitrageData_2.length)) return [3 /*break*/, 4];
                        bestCrossedMarket = arbitrageData_2[_b];
                        return [5 /*yield**/, _loop_1(bestCrossedMarket)];
                    case 2:
                        state_1 = _c.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _c.label = 3;
                    case 3:
                        _b++;
                        return [3 /*break*/, 1];
                    case 4: throw new Error("No arbitrage submitted to relay");
                }
            });
        });
    };
    return Arbitrage;
}());
exports.Arbitrage = Arbitrage;
