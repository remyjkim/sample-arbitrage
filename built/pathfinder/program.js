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
var commander_1 = require("commander");
var ARB = require("./arbitrage");
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var inquirer = require('inquirer');
var program = new commander_1.Command();
// CMD: Start
program
    .command('start')
    .option('--tokens <number>', 'number of highest daily volume tokens to consider')
    .option('--timeout <seconds>', 'polling timeout')
    .option('-x --dex', 'select considered dexes')
    .option('-d --debug', 'enable debug mode')
    .description('begin searching for dex cycles repeatedly')
    .action(function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var timeout, numberTokens, debug, dexs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                timeout = (options.timeout) ? options.timeout * 1000 : constants_1.DEFAULT_TIMEOUT;
                numberTokens = (options.tokens) ? options.tokens : constants_1.DEFAULT_TOKEN_NUMBER;
                debug = (options.debug) ? true : false;
                return [4 /*yield*/, parseDexs(options)];
            case 1:
                dexs = _a.sent();
                _a.label = 2;
            case 2:
                if (!true) return [3 /*break*/, 5];
                return [4 /*yield*/, ARB.main(numberTokens, dexs, debug)];
            case 3:
                _a.sent();
                return [4 /*yield*/, utils_1.sleep(timeout)];
            case 4:
                _a.sent();
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); });
// CMD: Run
program
    .command('run')
    .option('--tokens <number>', 'number of highest daily volume tokens to consider')
    .option('-x --dex', 'select considered dexes')
    .option('-d --debug', 'enable debug mode')
    .description('search once for dex cycles')
    .action(function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var numberTokens, dexs, debug;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                numberTokens = (options.tokens) ? options.tokens : constants_1.DEFAULT_TOKEN_NUMBER;
                return [4 /*yield*/, parseDexs(options)];
            case 1:
                dexs = _a.sent();
                debug = (options.debug) ? true : false;
                return [4 /*yield*/, ARB.main(numberTokens, dexs, debug)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function parseDexs(options) {
    return __awaiter(this, void 0, void 0, function () {
        var dexs, dexAnswers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dexs = new Set();
                    if (!options.dex) return [3 /*break*/, 2];
                    return [4 /*yield*/, inquireDex()];
                case 1:
                    dexAnswers = _a.sent();
                    (dexAnswers.DEXs.includes('UniswapV3')) ? dexs.add(constants_1.DEX.UniswapV3) : null;
                    (dexAnswers.DEXs.includes('Sushiswap')) ? dexs.add(constants_1.DEX.Sushiswap) : null;
                    return [3 /*break*/, 3];
                case 2:
                    Object.keys(constants_1.DEX).filter(function (v) { return !isNaN(Number(v)); }).forEach(function (key, index) { dexs.add(index); });
                    _a.label = 3;
                case 3: return [2 /*return*/, dexs];
            }
        });
    });
}
function inquireDex() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, inquirer
                    .prompt([
                    {
                        type: 'checkbox',
                        message: 'Select DEXs',
                        name: 'DEXs',
                        choices: [{ name: 'UniswapV3' }, { name: 'Sushiswap' }],
                        validate: function (answer) {
                            if (answer.length < 1)
                                return 'You must choose at least one DEX.';
                            return true;
                        },
                    },
                ])
                    .then(function (answers) {
                    return answers;
                })];
        });
    });
}
program.parse();
