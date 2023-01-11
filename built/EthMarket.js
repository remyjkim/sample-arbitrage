"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthMarket = void 0;
var EthMarket = /** @class */ (function () {
    function EthMarket(marketAddress, tokens, protocol) {
        this._marketAddress = marketAddress;
        this._tokens = tokens;
        this._protocol = protocol;
    }
    Object.defineProperty(EthMarket.prototype, "tokens", {
        get: function () {
            return this._tokens;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EthMarket.prototype, "marketAddress", {
        get: function () {
            return this._marketAddress;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EthMarket.prototype, "protocol", {
        get: function () {
            return this._protocol;
        },
        enumerable: false,
        configurable: true
    });
    return EthMarket;
}());
exports.EthMarket = EthMarket;
