---
name: build-sonnet
description: Build software with AgentWe, with Sonnet as the Brain. Same as /agentwe:build, which uses Opus.
argument-hint: "[what to build, or an existing project ID]"
disable-model-invocation: true
model: sonnet
---

Read `${CLAUDE_PLUGIN_ROOT}/skills/build/SKILL.md` and follow it exactly, skipping its frontmatter. Use this request wherever it says `$ARGUMENTS`:

$ARGUMENTS
