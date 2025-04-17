import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

// Create a map to store the transport for each session
const sessionTransport: Map<string, SSEServerTransport> = new Map();

// listen port
const port = 9000

// Create a new server instance every time a new connection is made to ensure concurrency
const createServer = () => {
  // Create server instance
  const server = new McpServer({
    name: "mcp-server",
    version: "1.0.0",
  });
  
  // Implement your tools here
  server.tool(
    "Hello World",
    "Return string 'hello world from SCF!'",
    {
      // Define input parameters using zod. example: 
      // prefix: z.string().describe('prefix').optional(),
    },
    async () => {
      console.log("Hello World tool called");
      return {
        content: [{
          type: "text",
          text: 'hello world from SCF!',
        }]
      }
    },
  );
  return server;
}

const app = express();

app.get("/sse", async (req, res) => {
  console.log("SSE connection is opened");
  const server = createServer();
  server.server.onclose = async () => {
    await server.close();
    sessionTransport.delete(transport.sessionId);
  };
  const transport = new SSEServerTransport("/messages", res);
  sessionTransport.set(transport.sessionId, transport);
  await server.server.connect(transport);
  return;
});

app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId as string;
  if (!sessionId) {
      throw new Error("sessionId query parameter is required");
  }
  const transport = sessionTransport.get(sessionId);
  if (transport) {
    console.log("SSE message received");
    await transport.handlePostMessage(req, res);
  }
  return;
});

app.listen(port, () => {
  console.log(`MCP Server is running on port ${port}`);
});
