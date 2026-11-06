import assert from "node:assert/strict";
import { test } from "node:test";
import { afterFailure, budgetState } from "./guardrails.ts";

test("a new error gets a repair loop", () => {
  const next = afterFailure({ attempts: 0, lastError: null }, "Build failed");
  assert.equal(next.status, "pending");
  assert.equal(next.attempts, 1);
  assert.equal(next.stop, false);
});

test("the same error twice stops, ignoring case and spacing", () => {
  const next = afterFailure({ attempts: 1, lastError: "Build  failed" }, " build failed ");
  assert.equal(next.status, "error");
  assert.equal(next.stop, true);
});

test("three different errors are allowed and the fourth stops", () => {
  assert.equal(afterFailure({ attempts: 2, lastError: "b" }, "c").stop, false);
  const fourth = afterFailure({ attempts: 3, lastError: "c" }, "d");
  assert.equal(fourth.stop, true);
  assert.equal(fourth.attempts, 4);
});

test("budget warns at 80 percent of tokens or steps", () => {
  const base = { tokensLimit: 1000, stepsLimit: 100 };
  assert.equal(budgetState({ ...base, tokensUsed: 799, stepsUsed: 0 }).warning, false);
  assert.equal(budgetState({ ...base, tokensUsed: 800, stepsUsed: 0 }).warning, true);
  assert.equal(budgetState({ ...base, tokensUsed: 0, stepsUsed: 80 }).warning, true);
  assert.equal(budgetState({ ...base, tokensUsed: 0, stepsUsed: 99 }).exceeded, false);
  assert.equal(budgetState({ ...base, tokensUsed: 1000, stepsUsed: 0 }).exceeded, true);
});
