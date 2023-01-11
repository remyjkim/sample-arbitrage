"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TOKEN_NUMBER = exports.DEFAULT_TIMEOUT = exports.MIN_TVL = exports.DEX = void 0;
var DEX;
(function (DEX) {
    DEX[DEX["UniswapV3"] = 0] = "UniswapV3";
    DEX[DEX["Sushiswap"] = 1] = "Sushiswap";
})(DEX || (DEX = {}));
exports.DEX = DEX;
var MIN_TVL = 50000;
exports.MIN_TVL = MIN_TVL;
var DEFAULT_TIMEOUT = 5000; //ms
exports.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;
var DEFAULT_TOKEN_NUMBER = 5;
exports.DEFAULT_TOKEN_NUMBER = DEFAULT_TOKEN_NUMBER;
