import assert from "node:assert/strict";
import { test } from "node:test";
import { safePath } from "./site.ts";

test("safePath keeps same-site paths", () => {
  assert.equal(safePath("/reset-password"), "/reset-password");
  assert.equal(safePath("/oauth/consent?authorization_id=1"), "/oauth/consent?authorization_id=1");
});

test("safePath rejects other websites", () => {
  for (const path of ["//evil.com", "/\\evil.com", "https://evil.com", "", null]) {
    assert.equal(safePath(path), "/home");
  }
});
