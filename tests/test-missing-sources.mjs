import {describe, it} from "node:test";

import {readConfig} from "../src/index.mjs";
import assert from 'node:assert/strict';

describe("Test single config reader", async () => {
    /**
     * Test the readConfig function with empty sources
     */
    it("Empty sources", async () => {
        const result = await readConfig([]);
        assert.deepEqual(result, {});
    });

    /**
     * Test the readConfig function with empty sources with defaults 
     */
    it("Empty sources with defaults", async () => {
        const result = await readConfig([], [], {foo: "bar"});
        assert.deepEqual(result, {foo: "bar"});
    });

    /**
     * Test the readConfig function with empty sources with 
     * defaults and keys
     */
    it("Empty sources with defaults and keys", async () => {
        const result = await readConfig([], ["foo"], {foo: "bar"});
        assert.deepEqual(result, {foo: "bar"});
    });

    /** 
     * Test the readConfig function with empty sources with 
     * defaults and extra keys
     */
    it("Empty sources with defaults and extra keys", async () => {
        try {
            const result = await readConfig([], ["foo", "bar"], {foo: "bar"});
            assert.fail("Should have thrown an error");
        } catch (e) {
            if (e instanceof assert.AssertionError) {
                throw e;
            }

            assert.strictEqual(e.message, "missing configuration for attribute: bar");
        }
    });

    /**
     * Test the readConfig function with empty sources and no defaults but expects keys
     * to be present
     */
    it("Empty sources with no defaults and keys", async () => {
        try {
            const result = await readConfig([], ["foo"]);
            assert.fail("Should have thrown an error");
        } catch (e) {
            if (e instanceof assert.AssertionError) {
                throw e;
            }

            assert.strictEqual(e.message, "missing configuration for attribute: foo");
        }
    });
});