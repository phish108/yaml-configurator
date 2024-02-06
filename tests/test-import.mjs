import {describe, it} from "node:test";
import assert from 'node:assert/strict';
import {readConfig} from "../src/index.mjs";  // <--- this is the import that is being tested

describe("Test config reader with imports", async () => {

    it("import from relative path", async () => {
        const result = await readConfig(["./tests/datafiles/file_a.yaml"]);
        assert.deepEqual(result, {"foo": "bar", "bar": "baz"});
    });

    it("import with defaults", async () => {
        const result = await readConfig(["./tests/datafiles/file_a.yaml"], [], {foo: "baz"});
        assert.deepEqual(result, {"foo": "bar", "bar": "baz"});
    });

    it("import nested", async () => {
        const result = await readConfig(["./tests/datafiles/file_b.yaml"]);
        assert.deepEqual(result, {"foo": "Hello", "bar": {"foo_deep": "World", "bar_deep": "Check", "dive": {"foo": "Dive"}}, "arr": [{"foo": "bar", "bar": {"foo": "baz"}}, {"baz": "foo", "qux": {"foo": "bar"}, "bar": {"baz": "baz"}}]});
    });

    it("import nested with default", async () => {
        const result = await readConfig(["./tests/datafiles/file_b.yaml"], [], {foo: "baz"});

        assert.deepEqual(result, {"foo": "Hello", "bar": {"foo_deep": "World", "bar_deep": "Check", "dive": {"foo": "Dive"}}, "arr": [{"foo": "bar", "bar": {"foo": "baz"}}, {"baz": "foo", "qux": {"foo": "bar"}, "bar": {"baz": "baz"}}]});
    });

    it("import nested with default and requirements", async () => {
        const result = await readConfig(["./tests/datafiles/file_b.yaml"], ["bar.foo_deep"], {foo: "baz"});

        assert.deepEqual(result, {"foo": "Hello", "bar": {"foo_deep": "World", "bar_deep": "Check", "dive": {"foo": "Dive"}}, "arr": [{"foo": "bar", "bar": {"foo": "baz"}}, {"baz": "foo", "qux": {"foo": "bar"}, "bar": {"baz": "baz"}}]});
    });

    it("import nested with default and missing requirements", async () => {
        try {
            const result = await readConfig(["./tests/datafiles/file_b.yaml"], ["bar.foo_deep2"], {foo: "baz"});
        } catch (e) {
            if (e instanceof assert.AssertionError) {
                throw e;
            }
            assert.strictEqual(e.message, "missing configuration for key: foo_deep2 (in bar.foo_deep2)");
        }
    });

    it("import nested with deep defaults and requirements", async () => {
        const result = await readConfig(["./tests/datafiles/file_b.yaml"], ["bar.foo_deep"], {"bar": {"foo_deep": "Mars"}});
        assert.deepEqual(result, {"foo": "Hello", "bar": {"foo_deep": "World", "bar_deep": "Check", "dive": {"foo": "Dive"}}, "arr": [{"foo": "bar", "bar": {"foo": "baz"}}, {"baz": "foo", "qux": {"foo": "bar"}, "bar": {"baz": "baz"}}]});
    });


    it("import nested with override defaults and requirements", async () => {
        const result = await readConfig(["./tests/datafiles/file_b.yaml"], ["bar.foo_deep"], {"bak": {"foo_deep": "Mars"}});
        assert.deepEqual(result, {"foo": "Hello", "bar": {"foo_deep": "World", "bar_deep": "Check", "dive": {"foo": "Dive"}}, "arr": [{"foo": "bar", "bar": {"foo": "baz"}}, {"baz": "foo", "qux": {"foo": "bar"}, "bar": {"baz": "baz"}}], "bak": {"foo_deep": "Mars"}});
    });

    it("import nested with override deep defaults and requirements", async () => {
        const result = await readConfig(["./tests/datafiles/file_b.yaml"], ["bar.foo_deep"], {"bar": {"foo_deep2": "Mars"}});

        assert.deepEqual(result, {"foo": "Hello", "bar": {"foo_deep": "World", "bar_deep": "Check", "dive": {"foo": "Dive"}, "foo_deep2": "Mars"}, "arr": [{"foo": "bar", "bar": {"foo": "baz"}}, {"baz": "foo", "qux": {"foo": "bar"}, "bar": {"baz": "baz"}}]});
    });


    it("import nested with override bad defaults and requirements", async () => {
        const result = await readConfig(["./tests/datafiles/file_b.yaml"], ["bar.foo_deep"], {"bar": "Mars"});
        
        assert.deepEqual(result, {"foo": "Hello", "bar": {"foo_deep": "World", "bar_deep": "Check", "dive": {"foo": "Dive"}}, "arr": [{"foo": "bar", "bar": {"foo": "baz"}}, {"baz": "foo", "qux": {"foo": "bar"}, "bar": {"baz": "baz"}}]});
    });
});
