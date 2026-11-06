import assert from "node:assert/strict";
import { test } from "node:test";
import { PREVIEW_POLICY, previewDocument, sortSections } from "./preview.ts";

test("preview document blocks network access and keeps the policy in the head", () => {
  assert.ok(PREVIEW_POLICY.startsWith("default-src 'none'"));
  assert.ok(!PREVIEW_POLICY.includes("connect-src"));
  const document = previewDocument();
  assert.ok(document.indexOf("Content-Security-Policy") < document.indexOf("<script>"));
});

test("sections keep their order when positions tie", () => {
  const sorted = sortSections([
    { id: "b", position: 1 },
    { id: "a", position: 1 },
    { id: "c", position: 0 },
  ]);
  assert.deepEqual(sorted.map((section) => section.id), ["c", "a", "b"]);
});
