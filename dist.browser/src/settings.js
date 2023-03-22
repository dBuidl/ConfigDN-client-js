var Settings = /** @class */ (function () {
    /**
     * Creates a new instance of settings
     * @param authKey Authirization Key, found on site
     * @param endpoint Endpoint, to use
     * @param refreshInterval How often to refresh data
     */
    function Settings(authKey, endpoint, refreshInterval) {
        this.endpoint = 'https://cdn.configdn.com/';
        this.refreshInterval = 60;
        this.authKey = '';
        this.setAuthKey(authKey);
        this.setEndpoint(endpoint);
        this.changeRefreshInterval(refreshInterval);
    }
    /**
     * Sets authorizaiton key
     * @param authKey Auth Key
     */
    Settings.prototype.setAuthKey = function (authKey) {
        this.authKey = authKey;
    };
    /**
     * Changes the endpoint
     * @param newEndpoint new endpoint to set to, must start with http/https
     * @throws Error
     */
    Settings.prototype.setEndpoint = function (newEndpoint) {
        var regexExp = /[-a-zA-Z0-9@:%._\+~=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~?&//=]*)?/gi;
        var regex = new RegExp(regexExp);
        if (!newEndpoint.match(regex)) {
            // throw new Error('Invalid URL');
        }
        if (!newEndpoint.endsWith('/')) {
            newEndpoint += '/';
        }
        this.endpoint = newEndpoint;
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
        this.refreshInterval = newInterval;
    };
    /**
     * Gets current endpoint
     */
    Settings.prototype.getEndpoint = function () {
        return this.endpoint;
    };
    /**
     * Gets current refresh interval
     */
    Settings.prototype.getRefreshInterval = function () {
        return this.refreshInterval;
    };
    /**
     * Gets auth key
     */
    Settings.prototype.getAuthKey = function () {
        return this.authKey;
    };
    return Settings;
}());
export { Settings };
