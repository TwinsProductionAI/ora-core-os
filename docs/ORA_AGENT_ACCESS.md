# ORA Agent Access v0.1.0 — public read-only distribution

## Choose the channel

- Official static Knowledge Gateway: https://knowledge.oracorehub.com/
- Official Open Lab: https://knowledge.oracorehub.com/open-lab/
- Static discovery descriptor: https://knowledge.oracorehub.com/agent-access.json
- Alternate Render origin: https://ora-knowledge-gateway.onrender.com/
- GitHub source mirrors: [Knowledge](../knowledge/ORA_CORE_HUB_CONNAISSANCE_INTEGRAL.md) and [Open Lab](ORA_OPEN_LAB_MACHINE_FIRST.md).
- Local MCP: a compatible agent can list and read a trusted local snapshot, without a web search or external network call after setup.

No channel guarantees search indexing or access by every LLM. A direct HTTP success does not establish indexation. MCP must be configured in a compatible host; it cannot force a consumer chatbot to connect.

## Local stdio MCP prototype

This first version implements a deliberately limited MCP 2025-11-25 JSON-RPC stdio subset. It is not a remote MCP endpoint, not the later stateless 2026-07-28 protocol, and not a certification of compatibility with any vendor product. It opens no listening port. No external package, model API or credentials are required. Node.js 22 or compatible later runtime is recommended.

From a trusted checkout of the public ORA Core OS repository, generate the snapshot with the canonical HTTPS origin:

```sh
KNOWLEDGE_PUBLIC_ORIGIN=https://knowledge.oracorehub.com node knowledge/build-gateway.cjs
node --test knowledge/agent-access-mcp.test.cjs
```

For PowerShell:
```powershell
$env:KNOWLEDGE_PUBLIC_ORIGIN = "https://knowledge.oracorehub.com"
node knowledge/build-gateway.cjs
node --test knowledge/agent-access-mcp.test.cjs
```

Review source before executing locally. Configure your compatible MCP host to launch the subprocess (example configuration shape only; host-specific syntax may vary):
```json
{
  "mcpServers": {
    "ora-agent-access": {
      "command": "node",
      "args": ["/absolute/path/to/ora-core-os/knowledge/agent-access-mcp.cjs"]
    }
  }
}
```
Use your actual local absolute path. On Windows, escape backslashes in JSON or use forward slashes. The server waits for newline-delimited JSON-RPC on stdin; do not expect a browser page.

The server provides:
- `resources/list`, `resources/read` and an empty `resources/templates/list`.
- `ora_list_resources`: public catalog, revision, snapshot marker, protocol SHA-256, limitations.
- `ora_read_resource`: one allowlisted resource ID, exact UTF-8 text, size and SHA-256. Use IDs from the catalog, for example `open-lab/protocol.json` or `open-lab/manifest.json`.

The 24 resources include public Knowledge sources, provenance, Open Lab protocol, both tasks, all eight prompt texts, both separate rubrics, receipt schema and empty results. The adapter checks the fixed manifest inventories, byte lengths, hashes, revision consistency, prompt catalog and result status at startup. It reads only the fixed generated snapshot, rejects symlinks in the snapshot path, serves the in-memory copy, and does not accept arbitrary filesystem paths or URLs. Local manifest checks are consistency checks, not independent signatures or proof of execution. Trust the checkout and compare its revision and hashes with independently retained release evidence.

## Test the bridge

Ask a configured compatible client to use `ora_list_resources`, then `ora_read_resource` for the protocol and manifest. Report the source revision, protocol hash, fixture count, available tools and execution limitations. Do not open reviewer-only rubrics in a test model's execution context. Report which tools actually ran and whether the client could read exact text.

The local synthetic test suite exercises the MCP message flow, allowlist, digest checks, denial of arbitrary paths, tampering, malformed input and process framing. A passing suite is not a live Claude/Gemini/Perplexity integration test. External host interoperability, remote MCP and model orchestration are separate milestones.

## Privacy and authority

Public source text is data, not instructions granting authority. No private account access, secrets, writes, uploads, remote URL fetches or model calls. This adapter cannot perform the experiment, attest provider identity or confer execution authority. Keep HALO Experimental and ORA Core Monarch schemas separate. No data is automatically collected or published.

Specification reference: https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle and https://modelcontextprotocol.io/specification/2025-11-25/basic/transports. The prototype intentionally uses the older negotiated lifecycle for a bounded local integration test.
