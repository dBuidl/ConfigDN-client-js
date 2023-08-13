export class Settings {
  endpoint = "https://cdn.configdn.com/";
  refreshInterval = 60;
  authKey = "";

  /**
   * Creates a new instance of settings
   * @param authKey Authorization Key, found on site
   * @param endpoint Endpoint, to use
   * @param refreshInterval How often to refresh data
   */
  constructor(authKey: string, endpoint: string, refreshInterval: number) {
    this.setAuthKey(authKey);
    this.setEndpoint(endpoint);
    this.changeRefreshInterval(refreshInterval);
  }

  /**
   * Sets authorization key
   * @param authKey Auth Key
   */
  setAuthKey(authKey: string) {
    this.authKey = authKey;
  }

  /**
   * Changes the endpoint
   * @param newEndpoint new endpoint to set to, must start with http/https
   * @throws Error
   */
  setEndpoint(newEndpoint: string) {
    const regexExp = /[-a-zA-Z0-9@:%._+~=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~?&/=]*)?/gi;
    const regex = new RegExp(regexExp);

    if (!newEndpoint.match(regex)) {
      // throw new Error('Invalid URL');
    }
    if (!newEndpoint.endsWith("/")) {
      newEndpoint += "/";
    }
    this.endpoint = newEndpoint;
  }

  /**
   * Changes refresh interval
   * @param  newInterval interval in seconds
   * @throws Error
   */
  changeRefreshInterval(newInterval: number) {
    if (Math.sign(newInterval) !== 1) {
      throw new Error("New interval must be a positive integer");
    }
    this.refreshInterval = newInterval;
  }

  /**
   * Gets current endpoint
   */
  getEndpoint(): string {
    return this.endpoint;
  }

  /**
   * Gets current refresh interval
   */
  getRefreshInterval(): number {
    return this.refreshInterval;
  }

  /**
   * Gets auth key
   */
  getAuthKey(): string {
    return this.authKey;
  }
}
