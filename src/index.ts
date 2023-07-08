import { Settings } from './settings';
import version from '../package.json';
import axios from 'axios';

interface KeyValuePair {
    v: any
}

export class ConfigDN {
    settings: Settings;
    lastUpdate: number;
    fetchedConfig: Map<String, Object> = new Map();

    /**
     * Creates a new instance
     * @param authKey Authorization key, required
     * @param apiEndpoint Endpoint, defaults to ConfigDN CDN
     * @param refreshInterval How often to refresh config in seconds, defaults to 60 seconds
     */
    constructor(authKey: string, apiEndpoint: string = 'https://cdn.configdn.com/', refreshInterval: number = 60) {
        this.settings = new Settings(authKey, apiEndpoint, refreshInterval);
        this.refreshConfig(true);
        this.lastUpdate = Date.now() / 1000;
    }

    /**
     * Forces a refresh of config
     * @param errorOnFail Throws an error if it fails
     */
    async refreshConfig(errorOnFail: boolean = false): Promise<void> {
        await axios.request({
            method: 'GET',
            url: this.settings.getEndpoint() + 'public_api/v1/get_config/',
            headers: {
                'ConfigDN-Client-Version': 'ConfigDN-JS/' + version,
                'Authorization': this.settings.getAuthKey(),
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            const responseMap = new Map(Object.entries(response.data));
            if (!responseMap.get('s')) {
                if (errorOnFail) {
                    throw new Error('Could not download config, problem: ' + responseMap.get('e'));
                } else {
                    return;
                }
            }
            const data: Object = responseMap.get('d') as Object;
            this.fetchedConfig = new Map(Object.entries(data));
        }).catch((err) => {
            throw new Error(err);
        })
    }

    /**
     * Gets the value for a key, if local config is blank, will attempt to retrieve it first, if it's time to refresh, it will wait for refresh first
     * @param key Key to get value for
     * @param defaultValue Default value to return, cannot be null
     * @returns Value
     */
    async get(key: string, defaultValue: any = null): Promise<any> {
        if (this.fetchedConfig.size === 0 || this.lastUpdate + this.settings.getRefreshInterval() > Date.now() / 1000) {
            await this.refreshConfig()
        }
        return this.getLocal(key, defaultValue);
    }

    /**
     * Gets value for a key, will refresh in the background for new config it it's time
     * @param key Key to get value for
     * @param defaultValue Default value to return, cannot be null
     * @returns Value
     */
    getLocal(key: string, defaultValue: any = null): any {
        if (this.lastUpdate + this.settings.getRefreshInterval() > Date.now() / 1000) {
            this.refreshConfig()
        }
        if (this.fetchedConfig.has(key)) {
            return ((this.fetchedConfig.get(key) as KeyValuePair)['v'])
        } else {
            if (defaultValue !== null) {
                return defaultValue
            } else {
                throw new Error('Key not in config');
            }
        }
    }

    /**
     * Changes refresh interval
     * @param newInterval new interval
     */
    changeRefreshInterval(newInterval: number) {
        this.settings.changeRefreshInterval(newInterval);
    }
}