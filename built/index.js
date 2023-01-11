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
var ethers_provider_bundle_1 = require("@flashbots/ethers-provider-bundle");
var ethers_1 = require("ethers");
var abi_1 = require("./abi");
var UniswappyV2EthPair_1 = require("./UniswappyV2EthPair");
var addresses_1 = require("./addresses");
var Arbitrage_1 = require("./Arbitrage");
var https_1 = require("https");
var utils_1 = require("./utils");
var ARB = require("./pathfinder/arbitrage");
var constants_1 = require("./pathfinder/constants");
var ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || "https://eth-goerli.g.alchemy.com/v2/ohnv0w4gls6xU1jy3y3bF0jHvf-7JXWE";
var PRIVATE_KEY = process.env.PRIVATE_KEY || "733d5b17a322079b0cb48211b27bf492a797298cf2091e84164b0f3811bddadd";
var BUNDLE_EXECUTOR_ADDRESS = process.env.BUNDLE_EXECUTOR_ADDRESS || "0xc6ab4196e5252F72BF642A6445B38D22b236Ba8B";
var FLASHBOTS_RELAY_SIGNING_KEY = process.env.FLASHBOTS_RELAY_SIGNING_KEY || utils_1.getDefaultRelaySigningKey();
var MINER_REWARD_PERCENTAGE = parseInt(process.env.MINER_REWARD_PERCENTAGE || "80");
if (PRIVATE_KEY === "") {
    console.warn("Must provide PRIVATE_KEY environment variable");
    process.exit(1);
}
if (BUNDLE_EXECUTOR_ADDRESS === "") {
    console.warn("Must provide BUNDLE_EXECUTOR_ADDRESS environment variable. Please see README.md");
    process.exit(1);
}
if (FLASHBOTS_RELAY_SIGNING_KEY === "") {
    console.warn("Must provide FLASHBOTS_RELAY_SIGNING_KEY. Please see https://github.com/flashbots/pm/blob/main/guides/searcher-onboarding.md");
    process.exit(1);
}
var HEALTHCHECK_URL = process.env.HEALTHCHECK_URL || "";
var provider = new ethers_1.providers.StaticJsonRpcProvider(ETHEREUM_RPC_URL);
var arbitrageSigningWallet = new ethers_1.Wallet(PRIVATE_KEY);
var flashbotsRelaySigningWallet = new ethers_1.Wallet(FLASHBOTS_RELAY_SIGNING_KEY);
function healthcheck() {
    if (HEALTHCHECK_URL === "") {
        return;
    }
    https_1.get(HEALTHCHECK_URL).on('error', console.error);
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, flashbotsProvider, arbitrage, markets;
        var _this = this;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _b = (_a = console).log;
                    _c = "Searcher Wallet Address: ";
                    return [4 /*yield*/, arbitrageSigningWallet.getAddress()];
                case 1:
                    _b.apply(_a, [_c + (_g.sent())]);
                    _e = (_d = console).log;
                    _f = "Flashbots Relay Signing Wallet Address: ";
                    return [4 /*yield*/, flashbotsRelaySigningWallet.getAddress()];
                case 2:
                    _e.apply(_d, [_f + (_g.sent())]);
                    return [4 /*yield*/, ethers_provider_bundle_1.FlashbotsBundleProvider.create(provider, flashbotsRelaySigningWallet)];
                case 3:
                    flashbotsProvider = _g.sent();
                    arbitrage = new Arbitrage_1.Arbitrage(arbitrageSigningWallet, flashbotsProvider, new ethers_1.Contract(BUNDLE_EXECUTOR_ADDRESS, abi_1.BUNDLE_EXECUTOR_ABI, provider));
                    return [4 /*yield*/, UniswappyV2EthPair_1.UniswappyV2EthPair.getUniswapMarketsByToken(provider, addresses_1.FACTORY_ADDRESSES)];
                case 4:
                    markets = _g.sent();
                    provider.on('block', function (blockNumber) { return __awaiter(_this, void 0, void 0, function () {
                        var numberTokens, dexs, debug, arbitrageData;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    numberTokens = 5;
                                    dexs = new Set();
                                    dexs.add(constants_1.DEX.UniswapV3);
                                    dexs.add(constants_1.DEX.Sushiswap);
                                    debug = false;
                                    return [4 /*yield*/, ARB.main(numberTokens, dexs, debug)];
                                case 1:
                                    arbitrageData = _a.sent();
                                    console.log("hi");
                                    console.log(arbitrageData);
                                    console.log("hi");
                                    arbitrage.takeCrossedMarkets(blockNumber, MINER_REWARD_PERCENTAGE, arbitrageData).then(healthcheck).catch(console.error);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
main();
