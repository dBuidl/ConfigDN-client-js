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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ConfigDN_settings, _ConfigDN_lastUpdate;
import { Settings } from './settings';
import version from '../package.json';
import axios from 'axios';
var ConfigDN = /** @class */ (function () {
    /**
     * Creates a new instance
     * @param authKey Authorization key, required
     * @param apiEndpoint Endpoint, defaults to ConfigDN CDN
     * @param refreshInterval How often to refresh config in seconds, defaults to 60 seconds
     */
    function ConfigDN(authKey, apiEndpoint, refreshInterval) {
        if (apiEndpoint === void 0) { apiEndpoint = 'https://cdn.configdn.com/'; }
        if (refreshInterval === void 0) { refreshInterval = 60; }
        _ConfigDN_settings.set(this, void 0);
        _ConfigDN_lastUpdate.set(this, void 0);
        this.fetchedConfig = new Map();
        __classPrivateFieldSet(this, _ConfigDN_settings, new Settings(authKey, apiEndpoint, refreshInterval), "f");
        this.refreshConfig(true);
        __classPrivateFieldSet(this, _ConfigDN_lastUpdate, Date.now() / 1000, "f");
    }
    /**
     * Forces a refresh of config
     * @param errorOnFail Throws an error if it fails
     */
    ConfigDN.prototype.refreshConfig = function (errorOnFail) {
        if (errorOnFail === void 0) { errorOnFail = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.request({
                            method: 'GET',
                            url: __classPrivateFieldGet(this, _ConfigDN_settings, "f").getEndpoint() + 'public_api/v1/get_config/',
                            headers: {
                                'User-Agent': 'ConfigDN-JS/' + version,
                                'Authorization': __classPrivateFieldGet(this, _ConfigDN_settings, "f").getAuthKey(),
                                'Content-Type': 'application/json'
                            }
                        }).then(function (response) {
                            var responseMap = new Map(Object.entries(response.data));
                            if (!responseMap.get('s')) {
                                if (errorOnFail) {
                                    throw new Error('Could not download config, problem: ' + responseMap.get('e'));
                                }
                                else {
                                    return;
                                }
                            }
                            var data = responseMap.get('d');
                            _this.fetchedConfig = new Map(Object.entries(data));
                        }).catch(function (err) {
                            throw new Error(err);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the value for a key, if local congif is blank, will attempt to retrieve it first, if it's time to refresh, it will wait for refresh first
     * @param key Key to get value for
     * @param defaultValue Default value to return, cannot be null
     * @returns Value
     */
    ConfigDN.prototype.get = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.fetchedConfig.size === 0 || __classPrivateFieldGet(this, _ConfigDN_lastUpdate, "f") + __classPrivateFieldGet(this, _ConfigDN_settings, "f").getRefreshInterval() > Date.now() / 1000)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.refreshConfig()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.getLocal(key, defaultValue)];
                }
            });
        });
    };
    /**
     * Gets value for a key, will refresh in the background for new config it it's time
     * @param key Key to get value for
     * @param defaultValue Default value to return, cannot be null
     * @returns Value
     */
    ConfigDN.prototype.getLocal = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        if (__classPrivateFieldGet(this, _ConfigDN_lastUpdate, "f") + __classPrivateFieldGet(this, _ConfigDN_settings, "f").getRefreshInterval() > Date.now() / 1000) {
            this.refreshConfig();
        }
        if (this.fetchedConfig.has(key)) {
            return (this.fetchedConfig.get(key)['v']);
        }
        else {
            if (defaultValue !== null) {
                return defaultValue;
            }
            else {
                throw new Error('Key not in config');
            }
        }
    };
    /**
     * Changes refresh interval
     * @param newInterval new interval
     */
    ConfigDN.prototype.changeRefreshInterval = function (newInterval) {
        __classPrivateFieldGet(this, _ConfigDN_settings, "f").changeRefreshInterval(newInterval);
    };
    return ConfigDN;
}());
export { ConfigDN };
_ConfigDN_settings = new WeakMap(), _ConfigDN_lastUpdate = new WeakMap();
