var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Settings_instances, _Settings_endpoint, _Settings_refreshInterval, _Settings_authKey, _Settings_setAuthKey;
var Settings = /** @class */ (function () {
    /**
     * Creates a new instance of settings
     * @param authKey Authirization Key, found on site
     * @param endpoint Endpoint, to use
     * @param refreshInterval How often to refresh data
     */
    function Settings(authKey, endpoint, refreshInterval) {
        _Settings_instances.add(this);
        _Settings_endpoint.set(this, 'https://cdn.configdn.com/');
        _Settings_refreshInterval.set(this, 60);
        _Settings_authKey.set(this, '');
        __classPrivateFieldGet(this, _Settings_instances, "m", _Settings_setAuthKey).call(this, authKey);
        this.setEndpoint(endpoint);
        this.changeRefreshInterval(refreshInterval);
    }
    /**
     * Changes the endpoint
     * @param newEndpoint new endpoint to set to, must start with http/https
     * @throws Error
     */
    Settings.prototype.setEndpoint = function (newEndpoint) {
        var regexExp = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(regexExp);
        if (!newEndpoint.match(regex)) {
            // throw new Error('Invalid URL');
        }
        if (!newEndpoint.endsWith('/')) {
            newEndpoint += '/';
        }
        __classPrivateFieldSet(this, _Settings_endpoint, newEndpoint, "f");
    };
    /**
     * Changes refresh interval
     * @param  newInterval interval in seconds
     * @throws Error
     */
    Settings.prototype.changeRefreshInterval = function (newInterval) {
        if (Math.sign(newInterval) !== 1) {
            throw new Error('New interval must be a positive integer');
        }
        __classPrivateFieldSet(this, _Settings_refreshInterval, newInterval, "f");
    };
    /**
     * Gets current endpoint
     */
    Settings.prototype.getEndpoint = function () {
        return __classPrivateFieldGet(this, _Settings_endpoint, "f");
    };
    /**
     * Gets current refresh interval
     */
    Settings.prototype.getRefreshInterval = function () {
        return __classPrivateFieldGet(this, _Settings_refreshInterval, "f");
    };
    /**
     * Gets auth key
     */
    Settings.prototype.getAuthKey = function () {
        return __classPrivateFieldGet(this, _Settings_authKey, "f");
    };
    return Settings;
}());
export { Settings };
_Settings_endpoint = new WeakMap(), _Settings_refreshInterval = new WeakMap(), _Settings_authKey = new WeakMap(), _Settings_instances = new WeakSet(), _Settings_setAuthKey = function _Settings_setAuthKey(authKey) {
    __classPrivateFieldSet(this, _Settings_authKey, authKey, "f");
};
