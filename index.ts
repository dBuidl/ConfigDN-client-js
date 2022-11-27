import {Config} from "./src/config";

export default class ConfigDN {

    config : Config;

    constructor(authKey : string, apiEndpoint : string = 'https://cdn.configdn.com/', refreshInterval : number = 60){
        this.config = new Config(authKey, apiEndpoint, refreshInterval);
    }

    
    
}
