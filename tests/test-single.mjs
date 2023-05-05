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
        const result = await readConfig([], ["foo", "bar"], {foo: "bar"});
        assert.deepEqual(result, {foo: "bar", bar: undefined});
    });
});