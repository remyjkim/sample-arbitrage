"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultRelaySigningKey = exports.bigNumberToDecimal = exports.ETHER = void 0;
var ethers_1 = require("ethers");
exports.ETHER = ethers_1.BigNumber.from(10).pow(18);
function bigNumberToDecimal(value, base) {
    if (base === void 0) { base = 18; }
    var divisor = ethers_1.BigNumber.from(10).pow(base);
    return value.mul(10000).div(divisor).toNumber() / 10000;
}
exports.bigNumberToDecimal = bigNumberToDecimal;
function getDefaultRelaySigningKey() {
    console.warn("You have not specified an explicity FLASHBOTS_RELAY_SIGNING_KEY environment variable. Creating random signing key, this searcher will not be building a reputation for next run");
    return ethers_1.Wallet.createRandom().privateKey;
}
exports.getDefaultRelaySigningKey = getDefaultRelaySigningKey;
