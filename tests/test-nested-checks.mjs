import {describe, it} from "node:test";
import assert from 'node:assert/strict';
import {readConfig} from "../src/index.mjs";  // <--- this is the import that is being tested
const config = [ "./tests/datafiles/file_b.yaml" ];

describe("Test config reader with nested key checks", async () => {
    it("check no nesting", () => {});
    it("check one level", () => {});
    it("check two levels", () => {});
});