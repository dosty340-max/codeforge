import assert from "node:assert/strict";
import { test } from "node:test";
import { chatgptLink, chatgptPrompt, claudeCodeLink, claudeCodePrompt, claudeWebLink, claudeWebPrompt, codexCommand, isAbsolutePath, targetLink, targetPrompt } from "./claude-links.ts";

const request = { noun: "Game", choices: ["Engine: Godot", "Look: 2D"], idea: "  A fox & stars  " };

test("prompts carry the creator, choices and idea", () => {
  assert.equal(claudeCodePrompt(request), "/agentwe:build Game (Engine: Godot, Look: 2D): A fox & stars");
  assert.equal(claudeWebPrompt({ noun: "App", choices: [], idea: "Notes" }), "Use AgentWe to build this. App: Notes");
});

test("Claude Code link encodes the prompt so it stays one parameter", () => {
  const link = new URL(claudeCodeLink("/agentwe:build A fox & stars\nnext"));
  assert.equal(link.protocol, "claude-cli:");
  assert.equal(link.searchParams.get("q"), "/agentwe:build A fox & stars\nnext");
  assert.ok(!claudeCodeLink("a b").includes("+"));
});

test("Claude Code link only accepts a safe absolute folder", () => {
  assert.equal(new URL(claudeCodeLink("x", "/Users/me/game")).searchParams.get("cwd"), "/Users/me/game");
  for (const folder of ["", "relative/path", "/Users/me/../secret"]) {
    assert.equal(new URL(claudeCodeLink("x", folder)).searchParams.has("cwd"), false);
  }
  assert.equal(isAbsolutePath("C:\\Projects\\game"), true);
});

test("web link encodes the prompt", () => {
  assert.equal(new URL(claudeWebLink("A & B")).searchParams.get("q"), "A & B");
});

test("chosen models reach Claude Code and the browser", () => {
  assert.equal(
    claudeCodePrompt({ ...request, brain: "fable", specialists: "opus" }),
    "/agentwe:build-fable Game (Engine: Godot, Look: 2D, Specialist model: opus): A fox & stars"
  );
  assert.ok(claudeCodePrompt({ ...request, brain: "opus", specialists: "sonnet" }).startsWith("/agentwe:build Game (Engine: Godot, Look: 2D): "));
  assert.ok(claudeCodePrompt({ ...request, brain: "../evil", specialists: "evil" }).startsWith("/agentwe:build Game (Engine: Godot, Look: 2D): "));
  assert.equal(new URL(claudeWebLink("x", "haiku")).searchParams.get("model"), "claude-haiku-5-5");
  assert.equal(new URL(claudeWebLink("x", "evil")).searchParams.has("model"), false);
});

test("ChatGPT gets a mention and an encoded link", () => {
  assert.equal(chatgptPrompt({ noun: "App", choices: [], idea: "Notes" }), "@AgentWe build this. App: Notes");
  assert.equal(new URL(chatgptLink("A & B")).searchParams.get("q"), "A & B");
});

test("Codex command cannot break out of its quotes", () => {
  const command = codexCommand({ noun: "App", choices: [], idea: "x'; rm -rf ~; echo '" });
  assert.ok(command.startsWith("codex 'Use the agentwe MCP server"));
  assert.ok(command.includes("x'\\''; rm -rf ~; echo '\\''"));
  assert.ok(!command.includes("x'; rm"));
  assert.ok(codexCommand(request, "/Users/me/my game").startsWith("cd '/Users/me/my game' && codex "));
  assert.ok(codexCommand(request, "/Users/me/../secret").startsWith("codex "));
});

test("every target has a prompt and only Codex has no link", () => {
  for (const target of ["claude-code", "claude-chrome", "chatgpt", "codex"] as const) {
    assert.ok(targetPrompt(target, request).includes("A fox & stars"));
  }
  assert.equal(targetLink("codex", request), null);
  assert.ok(targetLink("chatgpt", request)?.startsWith("https://chatgpt.com/"));
  assert.ok(targetLink("claude-chrome", request)?.startsWith("https://claude.ai/new"));
  assert.ok(targetLink("claude-code", request)?.startsWith("claude-cli://"));
});
