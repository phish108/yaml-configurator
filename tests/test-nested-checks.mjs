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

    /**
     * Test missing keys on first level with existing parent
     */
    it(" missing keys on first level with existing parent", async () => {
        try {
            const result = await readConfig(config, ["bar.baz_deep"]);
            assert.fail("Should have thrown an error");
        } catch (e) {
            if (e instanceof assert.AssertionError) {
                throw e;
            }

            assert.strictEqual(e.message, "missing configuration for key: baz_deep (in bar.baz_deep)");
        }
    });

    /**
     * Test missing keys on first level with missing parent
     */
    it(" missing keys on first level with missing parent", async () => {
        try {
            const result = await readConfig(config, ["baZ.baz_deep"]);
            assert.fail("Should have thrown an error");
        } catch (e) {
            if (e instanceof assert.AssertionError) {
                throw e;
            }

            assert.strictEqual(e.message, "missing configuration for key: baZ (in baZ.baz_deep)");
        }
    });


    /**
     * Test missing keys on second level
     */
    it("missing key on second level", async () => {
        try {
            const result = await readConfig(config, ["bar.dive.bar"]);
            assert.fail("Should have thrown an error");
        } catch (e) {
            if (e instanceof assert.AssertionError) {
                throw e;
            }

            assert.strictEqual(e.message, "missing configuration for key: bar (in bar.dive.bar)");
        }
    });

    it("missing key on second level with existing subling", async () => {
        try {
            const result = await readConfig(config, ["bar.dive.foo", "bar.dive.bar"]);
            assert.fail("Should have thrown an error");
        } catch (e) {
            if (e instanceof assert.AssertionError) {
                throw e;
            }

            assert.strictEqual(e.message, "missing configuration for key: bar (in bar.dive.bar)");
        }
    });

    it("missing key on second level with missing parent", async () => {
        try {
            const result = await readConfig(config, ["bar.drive.foo", "bar.dive.bar"]);
            assert.fail("Should have thrown an error");
        } catch (e) {
            if (e instanceof assert.AssertionError) {
                throw e;
            }

            assert.strictEqual(e.message, "missing configuration for key: drive (in bar.drive.foo)");
        }
    });

    it("missing key on second level with missing root", async () => {
        try {
            const result = await readConfig(config, ["baZ.drive.foo", "bar.dive.bar"]);
            assert.fail("Should have thrown an error");
        } catch (e) {
            if (e instanceof assert.AssertionError) {
                throw e;
            }

            assert.strictEqual(e.message, "missing configuration for key: baZ (in baZ.drive.foo)");
        }
    });

    /** 
     * Test nested keys in array objects
     */

    /**
     * Test nested keys missing in array objects
     */

    /**
     * Test deeply nested keys missing in array objects
     */

});