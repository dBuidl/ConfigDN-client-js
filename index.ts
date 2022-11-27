import {Settings } from "./src/settings";
import axios from 'axios';

interface KeyValuePair {
    v: any
}

export default class ConfigDN {
    #settings: Settings;
    fetchedConfig: Map<String, Object> = new Map();

    #refresh : number = -1;
    
    constructor(authKey: string, apiEndpoint: string = 'https://cdn.configdn.com/', refreshInterval: number = 60) {
        this.#settings = new Settings(authKey, apiEndpoint, refreshInterval);
        this.refreshConfig(true);
        this.#setupRefresh();
    }

    async refreshConfig(errorOnFail: boolean = false): Promise<void> {
        await axios.request({
            method: 'GET',
            url: this.#settings.getEndpoint() + 'public_api/v1/get_config/',
            headers: {
                'Authorization': this.#settings.getAuthKey(),
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

    async get(key: string): Promise<any> {
        if (this.fetchedConfig.size === 0) {
            await this.refreshConfig()
        }
        return this.getLocal(key);
    }

    getLocal(key : string) : any {
        if (this.fetchedConfig.has(key)) {
            return ((this.fetchedConfig.get(key) as KeyValuePair)['v'])
        } else {
            throw new Error('Key not in config');
        }
    }

    changeRefreshInterval(newInterval : number){
        this.#settings.changeRefreshInterval(newInterval);
        this.#setupRefresh();
    }

    #setupRefresh() {
        if (this.#refresh !== -1){
            clearInterval(this.#refresh);
        }
        this.#refresh = setInterval(() => {
            this.refreshConfig();
        }, this.#settings.getRefreshInterval());
    }
}