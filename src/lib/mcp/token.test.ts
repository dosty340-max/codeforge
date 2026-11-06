import assert from "node:assert/strict";
import { test } from "node:test";
import { isOAuthClientToken } from "./token.ts";

const tokenWith = (payload: object) =>
  `header.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.signature`;

test("OAuth tokens count as Claude connections", () => {
  assert.equal(isOAuthClientToken(tokenWith({ sub: "user", client_id: "client" })), true);
});

test("web sessions and malformed tokens do not", () => {
  assert.equal(isOAuthClientToken(tokenWith({ sub: "user" })), false);
  assert.equal(isOAuthClientToken(tokenWith({ client_id: "" })), false);
  assert.equal(isOAuthClientToken("not-a-token"), false);
});
