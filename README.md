# yaml-configurator
Read YAML configs from well-known locations

## Motivation

JS micro-services require a configuration. As this is such a common problem this package unifies this tasks by providing a standard interface for loading configurations from well-known locations. 

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

TBD
