import {describe, it} from "node:test";
import assert from 'node:assert/strict';
import {readConfig} from "../src/index.mjs";  // <--- this is the import that is being tested

const filelistA = "./tests/datafiles/file_a.yaml";
const filelistB = ["./tests/datafiles/file_a.yaml"];  
const filelistC = ["./tests/datafiles/file_a.yaml", "./tests/datafiles/file_b.yaml"];
const filelistD = ["./tests/datafiles/file_c.yaml", "./tests/datafiles/file_a.yaml"];
const filelistE = ["./tests/datafiles/file_c.yaml", "./tests/datafiles/file_d.yaml"];

describe("Test config reader file selection", async () => {
    it("Single file", async () => {
        const result = await readConfig(filelistA);
        assert.deepEqual(result, {foo: "bar", bar: "baz"});
    });

    it("Single file in array", async () => {
        const result = await readConfig(filelistB);
        assert.deepEqual(result, {foo: "bar", bar: "baz"});
    });

    it("Multiple files in array early matching", async () => {
        const result = await readConfig(filelistC);
        assert.deepEqual(result, {foo: "bar", bar: "baz"});
    });

    it("Multiple files in array late matching", async () => {
        const result = await readConfig(filelistD);
        assert.deepEqual(result, {foo: "bar", bar: "baz"});
    });

    it("Multiple files in array no match", async () => {
        const result = await readConfig(filelistE);
        assert.deepEqual(result, {});
    });

    it("Multiple files in array with defaults", async () => {
        const result = await readConfig(filelistC, [], {foo: "bar"});
        assert.deepEqual(result, {foo: "bar", bar: "baz"});
    });

    it("Multiple files in array with defaults and keys", async () => {
        const result = await readConfig(filelistC, ["foo"], {foo: "bar"});
        assert.deepEqual(result, {foo: "bar", bar: "baz"});
    });

    it("Multiple files in array with required key from defaults", async () => {
        const result = await readConfig(filelistC, ["baz"], {baz: "foo"});
        assert.deepEqual(result, {foo: "bar", bar: "baz", baz: "foo"});
    });

    it("Multiple files in array with defaults and extra keys", async () => {
        try {
            const result = await readConfig(filelistC, ["foo", "baz"], {foo: "bar"});
            assert.fail("Should have thrown an error");
        } catch (e) {
            if (e instanceof assert.AssertionError) {
                throw e;
            }

            assert.strictEqual(e.message, "missing configuration for key: baz");
        }
    });

    it("Multiple files in array with no defaults but expects key baz to be present", async () => {
        try {
            const result = await readConfig(filelistC, ["baz"]);
            assert.fail("Should have thrown an error");
        } catch (e) {
            if (e instanceof assert.AssertionError) {
                throw e;
            }

            assert.strictEqual(e.message, "missing configuration for key: baz");
        }
    });
});