import axios from "axios";
import version from "./Version";
import { Settings } from "./Settings";

interface KeyValuePair {
  v: any;
}

export class ConfigDN {
  settings: Settings;
  lastUpdate: number;
  fetchedConfig: Map<string, Object> = new Map();
  private refreshHandle: Promise<void> | null = null;
  private refreshAbortController: AbortController | null = null;
  private TimerID: NodeJS.Timeout | null = null;

  /**
     * Creates a new instance
     * @param authKey Authorization key, required
     * @param apiEndpoint Endpoint, defaults to ConfigDN CDN
     * @param refreshInterval How often to refresh config in seconds, defaults to 60 seconds
     */
  constructor(authKey: string, apiEndpoint = "https://cdn.configdn.com/", refreshInterval = 60) {
    this.settings = new Settings(authKey, apiEndpoint, refreshInterval);
    this.refreshConfig(true);
    this.lastUpdate = Date.now() / 1000;

    this.TimerID = setInterval(() => {
      this.refreshConfig();
    }, refreshInterval * 1000);
  }

  destroy(): void {
    if (this.refreshAbortController !== null) {
      this.refreshAbortController.abort();
    }
    if (this.TimerID !== null) {
      clearInterval(this.TimerID);
    }
  }

  /**
     * Forces a refresh of config
     * @param errorOnFail Throws an error if it fails
     */
  async refreshConfig(errorOnFail = false): Promise<void> {
    if (this.refreshHandle !== null) {
      await this.refreshHandle;
    }

    this.refreshHandle = new Promise<void>((resolve, reject) => {
      this.refreshAbortController = new AbortController();

      axios(this.settings.getEndpoint() + "public_api/v1/get_config/", {
        method: "GET",
        headers: {
          "User-Agent": "ConfigDN-JS/" + version,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          "Authorization": this.settings.getAuthKey(),
          "Content-Type": "application/json"
        },
        signal: this.refreshAbortController.signal
      }).then(async (response) => {
        const responseMap = new Map(Object.entries(response.data));
        if (!responseMap.get("s")) {
          if (errorOnFail) {
            reject(new Error("Could not download config, problem: " + responseMap.get("e")));
          }
          else {
            resolve();
          }
        }
        const data: Object = responseMap.get("d") as Object;
        this.fetchedConfig = new Map(Object.entries(data));
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });

    await this.refreshHandle.catch(console.error);

    this.lastUpdate = Date.now() / 1000;
    this.refreshHandle = null;
  }

  /**
     * Gets the value for a key, if local config is blank, will attempt to retrieve it first, if it's time to refresh, it will wait for refresh first
     * @param key Key to get value for
     * @param defaultValue Default value to return, cannot be null
     * @returns Value
     */
  async get(key: string, defaultValue: any = null): Promise<any> {
    if (this.fetchedConfig.has(key)) {
      return ((this.fetchedConfig.get(key) as KeyValuePair)["v"]);
    }
    else {
      if (defaultValue !== null) {
        return defaultValue;
      }
      else {
        throw new Error("Key not in config");
      }
    }
  }

  /**
     * Changes refresh interval
     * @param newInterval new interval
     */
  changeRefreshInterval(newInterval: number) {
    this.settings.changeRefreshInterval(newInterval);

    if (this.TimerID !== null) {
        clearInterval(this.TimerID);
        this.TimerID = setInterval(() => {
            this.refreshConfig();
        }, newInterval * 1000);
    }
  }
}
