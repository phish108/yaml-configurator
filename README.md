# yaml-configurator
Read simple YAML configs from well-known locations

## Motivation

Most JS micro-services require a configuration. This package unifies this common task by providing a standard interface for loading configurations from well-known locations.

## Getting started

```bash
npm i @phish108/yaml-configurator
```

In the index module: 

```js
import * as Config from "./ConfigReader.mjs";

// load from the first location that matches.
const cfg = await Config.readConfig(
        [
            "/etc/app/config.yaml",
            "./config.yaml", 
            "./tools/config.yaml"
        ]
    );
```

## Usage

This package provides a single interface function `readConfig()`. This function has three parameters: 
- Sources files
- Required configuration keys
- Default values

This allows to ensure complete and valid configurations before a service starts. 

**Source files** can be a single file name or a list of locations where to expect the configuration files. If no source file is provided or none of the provided sources can be found an empty configuration is returned (see default values). If more than one source location is provided, these file locations **must** be presented as an `Array`. In this case the function will load the configuration from the first matching locations.

**Required configuration keys** provide the means to validate a configuration. Currently, validation is limited to the presence of a key in the configuration. Such keys must be present at the top level of the configuration. By default this is an empty list. If the required keys are not present after merging the configuration with the default values, then the function throws an error with the message `missing configuration for key: YOUR_REQUIRED_KEY`. 

**Default values** provide default values for the configuration. These values are set to the configuration only if these values are not present in the loaded configuration. Like the required configuration keys, this mechanism allows  default values only at the top level of the configuration. 

A typical use case for using keys are credentials. In this case, the required secret information is linked to specific keys that are set to be required. All other keys can be set with defaults. If the secrets are not present in the configuration the function `readConfig()` will fail with an error.
