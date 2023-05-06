import {describe, it} from "node:test";
import assert from 'node:assert/strict';
import {readConfig} from "../src/index.mjs";  // <--- this is the import that is being tested
const config = [ "./tests/datafiles/file_b.yaml" ];
const fileContent = {
    foo: "Hello",
    bar: {
        foo_deep: "World",
        bar_deep: "Check",
        dive: {
            foo: "Dive"
        }
    }
};

describe("Test config reader with nested key checks", async () => {
    it("check no nesting", async () => {
        const result = await readConfig(config, ["bar"]);
        assert.deepStrictEqual(result, fileContent);
    });

    it("check one level", async () => {
        const result = await readConfig(config, ["bar.foo_deep"]);
        assert.deepStrictEqual(result, fileContent);

    });

    it("check two levels", async () => {
        const result = await readConfig(config, ["bar.dive.foo"]);
        assert.deepStrictEqual(result, fileContent);
    });
});