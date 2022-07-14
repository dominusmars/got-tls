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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.getBaseUrl = exports.startServer = exports.isConnected = exports.BACKEND = void 0;
var child_process_1 = require("child_process");
var path_1 = require("path");
var pubsub_js_1 = __importDefault(require("pubsub-js"));
var get_port_1 = __importDefault(require("get-port"));
var fs_1 = require("fs");
var WebSocket = require("ws");
var child;
var cleanExit = function (message) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!child)
            return [2 /*return*/];
        if (message) {
            console.log(message);
        }
        if (process.platform == "win32") {
            new Promise(function (resolve, reject) {
                (0, child_process_1.exec)("taskkill /pid " + child.pid + " /T /F", function (error, stdout, stderr) {
                    if (error) {
                        console.warn(error);
                    }
                    process.exit();
                    resolve(stdout ? stdout : stderr);
                });
            });
        }
        else {
            new Promise(function (resolve, reject) {
                if (child.pid) {
                    process.kill(-child.pid);
                    process.exit();
                }
            });
        }
        return [2 /*return*/];
    });
}); };
process.on("SIGINT", function () { return cleanExit(); });
process.on("SIGTERM", function () { return cleanExit(); });
var PORT;
var CONNECTED = false;
var isConnected = function () {
    return CONNECTED;
};
exports.isConnected = isConnected;
var connectToServer = function (callback) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, sleep(500)];
            case 1:
                _a.sent();
                exports.BACKEND = new WebSocket("ws://localhost:" + PORT + "/client");
                exports.BACKEND.onopen = function () {
                    console.log("Successfully Connnected To Backend Proxy");
                    CONNECTED = true;
                    callback(true, exports.BACKEND);
                };
                exports.BACKEND.onmessage = function (e) {
                    if (typeof e.data === "string") {
                        var responseData = JSON.parse(e.data);
                        pubsub_js_1.default.publish(responseData.id, responseData);
                    }
                };
                exports.BACKEND.onclose = function () {
                    console.log("Backend Proxy Client Closed Error! Retrying Connection...");
                    CONNECTED = false;
                    connectToServer(function () { });
                };
                exports.BACKEND.onerror = function () {
                    console.log("Backend Proxy Connection Error! Retrying Connection...");
                    CONNECTED = false;
                    // connectToServer()
                };
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                return [2 /*return*/, callback(false)];
            case 3: return [2 /*return*/];
        }
    });
}); };
var executables = {
    'darwin': 'got-tls-proxy',
    'linux': 'got-tls-proxy-linux',
    'win32': 'got-tls-proxy.exe',
};
var startServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var executableFilename_1, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, get_port_1.default)()];
            case 1:
                PORT = _a.sent();
                console.log("Starting Server...");
                executableFilename_1 = executables[process.platform];
                if (!executableFilename_1) {
                    throw new Error("Operating system not supported");
                }
                if (process.platform == 'linux') {
                    child = (0, child_process_1.spawn)((0, path_1.join)(__dirname, "../resources/" + executableFilename_1), {
                        env: { PROXY_PORT: PORT.toString() },
                        stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
                        windowsHide: true,
                    });
                }
                else {
                    child = (0, child_process_1.spawn)((0, path_1.join)(__dirname, "../resources/" + executableFilename_1), {
                        env: { PROXY_PORT: PORT.toString() },
                        shell: true,
                        stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
                        windowsHide: true,
                    });
                }
                child.on('spawn', function () {
                    console.log("Proxy Server Started");
                });
                child.on('error', function (message) {
                    if (message.message.includes("EACCES")) {
                        (0, fs_1.chmodSync)((0, path_1.join)(__dirname, "../resources/" + executableFilename_1), 511);
                        (0, exports.startServer)();
                    }
                });
                child.on('close', function () {
                    console.log("Proxy server Closed");
                });
                return [2 /*return*/, new Promise(function (resolve, rejects) {
                        connectToServer(function (success) {
                            success ? resolve(success) : rejects(success);
                        });
                    })];
            case 2:
                e_2 = _a.sent();
                console.log(e_2);
                return [2 /*return*/, e_2];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.startServer = startServer;
var dir = "/";
function getBaseUrl(url, prefix) {
    var urlAsArray = url.split(dir);
    var doubleSlashIndex = url.indexOf("://");
    if (doubleSlashIndex !== -1 && doubleSlashIndex === url.indexOf(dir) - 1) {
        urlAsArray.length = 3;
        var url_1 = urlAsArray.join(dir);
        if (prefix !== undefined)
            url_1 = url_1.replace(/http:\/\/|https:\/\//, prefix);
        return url_1;
    }
    else {
        var pointIndex = url.indexOf(".");
        if (pointIndex !== -1 && pointIndex !== 0) {
            return (prefix !== undefined ? prefix : "https://") + urlAsArray[0];
        }
    }
    return "";
}
exports.getBaseUrl = getBaseUrl;
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
exports.sleep = sleep;
