import YAML from "yaml";
import fs from "fs/promises";

export async function readConfig(locations, keys = [], defaults = {}) {
    let result = {};

    if (!(keys && Array.isArray(keys))) {
        keys = [];
    }

    if ( typeof locations === "string" ) {
        locations = [locations];
    }

    const locs = await Promise.all(
        locations.map((afile) => fs.stat(afile)
            .then(() => afile)
            .catch(() => undefined))
    );

    const filename = locs.filter((e) => e !== undefined).shift();

    result = await loadConfig(filename);
    result = mergeConfig(result, defaults);

    return verifyConfig(result, keys);
}

async function loadConfig(source) {
    let result = {};

    if (!source || typeof source !== "string" || source.length === 0) {
        return result;
    }

    try {
        const cfgdata = await fs.readFile(source, "utf-8");

        if (cfgdata !== undefined) {
            result = YAML.parse(cfgdata);
        }
    }
    catch (err) {
        console.log(`${JSON.stringify({
            message: "cannot read file",
            extra: err.message
        })}`);
    }

    return result;
}

function mergeConfig(config, defaults = {}) {
    if (!defaults) {
        defaults = {};
    }

    if (!config || typeof config !== "object" || Object.keys(config).length === 0) {
        return defaults;
    }

    const keys = Object.keys(defaults);

    if (keys.length === 0) {
        return config;
    }

    return keys.reduce((acc, k) => {
        if (!(k in acc)) {
            acc[k] = defaults[k];
        }
        
        return acc; 
    }, config);
}

function keycheck(config, key) {
    if (typeof config !== "object" || config === null || config === undefined) {
        throw new Error(`missing configuration object for key: ${key}})`);
    }

    if (!(key in config && config[key] !== undefined && config[key] !== null || config[key] === "")) {
        throw new Error(`missing configuration for key: ${key}`);
    }

    return config[key];
}

function verifyConfig(config, keys = []) {
    return keys.reduce((cfg, k) => { 
        const klist = k.split(".");

        klist.reduce((c, subkey) => {    
            return keycheck(c, subkey);
        }, cfg); 

        return cfg;
    }, config);
}
