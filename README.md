# AgentWe

Describe what you want to build. A Brain and specialist agents plan, build and verify it on your own Claude account, with progress on your dashboard.

Live app: https://codeforge-drab-three.vercel.app

## Connect Claude Code

```bash
claude plugin install agentwe --marketplace dosty340-max/codeforge && claude mcp login plugin:agentwe:agentwe
```

Then run this in Claude Code:

```
/agentwe:build A 2D platformer with ten levels
```

## Develop

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and add your Supabase project. Apply the files in `supabase/migrations` in order.

## Documentation

- [Testing guide](docs/TESTING.md)
- [MCP server and plugin](docs/MCP.md)
- [Agent catalog](docs/AGENCY_AGENTS.md)
- [Roadmap](docs/ROADMAP.md)

The agent catalog in `vendor/agency-agents` comes from [Agency Agents](https://github.com/msitarzewski/agency-agents) under the MIT License.
