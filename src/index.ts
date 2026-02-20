#!/usr/bin/env node
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

import { loadContent } from "./content-loader.js";
import { parseIntoSections } from "./parser.js";

// Store loaded articles/documents
interface LoadedContent {
  title: string;
  url?: string;
  filepath?: string;
  fullContent: string;
  sections: Array<{
    title: string;
    content: string;
    level: number;
  }>;
  loadedAt: Date;
}

// Engagement data types
interface PersonEngagement {
  name: string;
  reacted: boolean;
  comments: number;
}

interface EngagementEntry {
  url: string;
  title: string;
  loggedAt: string;
  engagedBy: PersonEngagement[];
}

const contentStore = new Map<string, LoadedContent>();

// Path to the engagement data file (stored in the project root)
const ENGAGEMENT_FILE = path.resolve(
    new URL(import.meta.url).pathname,
    "../../engagement-data.json"
);

// Helper: read engagement data from disk
async function readEngagementData(): Promise<EngagementEntry[]> {
  try {
    const raw = await fs.readFile(ENGAGEMENT_FILE, "utf-8");
    return JSON.parse(raw) as EngagementEntry[];
  } catch {
    // File doesn't exist yet — return empty array
    return [];
  }
}

// Helper: write engagement data to disk
async function writeEngagementData(data: EngagementEntry[]): Promise<void> {
  await fs.writeFile(ENGAGEMENT_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Create server instance
const server = new McpServer({
  name: "learning-mcp-server",
  version: "1.0.0",
});

// Register load_content tool
server.registerTool(
  "load_content",
  {
    description: "Load content from a URL or file path for learning. This parses the content into sections that can be accessed as resources.",
    inputSchema: {
      source: z
        .string()
        .describe("URL (starting with http:// or https://) or file path to load"),
      id: z
        .string()
        .optional()
        .describe("Optional custom ID for this content (defaults to URL or filename)"),
    },
  },
  async ({ source, id: customId }) => {
    try {
      // Load and parse content
      const { title, content, isUrl } = await loadContent(source);
      const sections = parseIntoSections(content);

      // Generate ID
      const id = customId || (isUrl ? new URL(source).hostname : source.split('/').pop() || 'document');

      // Store content
      const loadedContent: LoadedContent = {
        title,
        url: isUrl ? source : undefined,
        filepath: !isUrl ? source : undefined,
        fullContent: content,
        sections,
        loadedAt: new Date(),
      };

      contentStore.set(id, loadedContent);

      return {
        content: [
          {
            type: "text",
            text: `Successfully loaded "${title}" with ${sections.length} sections.\n\nContent ID: ${id}\n\nYou can now access this content as resources using the ID "${id}".`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error loading content: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register list_loaded_content tool
server.registerTool(
  "list_loaded_content",
  {
    description: "List all currently loaded content available for study",
    inputSchema: {},
  },
  async () => {
    const contentList = Array.from(contentStore.entries()).map(([id, content]) => ({
      id,
      title: content.title,
      sections: content.sections.length,
      source: content.url || content.filepath,
      loadedAt: content.loadedAt.toISOString(),
    }));

    return {
      content: [
        {
          type: "text",
          text: contentList.length > 0
            ? `Loaded content:\n\n${contentList.map(c =>
                `- ID: ${c.id}\n  Title: ${c.title}\n  Sections: ${c.sections}\n  Source: ${c.source}\n  Loaded: ${c.loadedAt}`
              ).join('\n\n')}`
              : 'No content currently loaded. Use the load_content tool to add content.',
        },
      ],
    };
  }
);

// Register remove_content tool
server.registerTool(
  "remove_content",
  {
    description: "Remove loaded content from the server",
    inputSchema: {
      id: z.string().describe("ID of the content to remove"),
    },
  },
  async ({ id }) => {
    if (contentStore.has(id)) {
      contentStore.delete(id);
      return {
        content: [
          {
            type: "text",
            text: `Content "${id}" removed successfully.`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `Content "${id}" not found.`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register log_engagement tool
server.registerTool(
  "log_engagement",
  {
    description: "Log engagement for an article. Provide the article URL and the names of people who reacted or commented. The article title will be fetched automatically. Data is persisted to a local JSON file.",
    inputSchema: {
      url: z.string().url().describe("The URL of the article"),
      engagedBy: z
          .array(z.object({
            name: z.string().describe("The person's name"),
            reacted: z.boolean().default(false).describe("Whether they reacted to the article"),
            comments: z.number().int().min(0).default(0).describe("Number of comments they left"),
          }))
          .describe("List of people and how they engaged with the article"),
    },
  },
  async ({ url, engagedBy }) => {
    try {
      // Fetch the article title using the existing loadContent utility
      let title = url;
      try {
        const loaded = await loadContent(url);
        title = loaded.title;
      } catch {
        // If we can't fetch the title, fall back to the URL
      }

      const entry: EngagementEntry = {
        url,
        title,
        loggedAt: new Date().toISOString(),
        engagedBy,
      };

      const data = await readEngagementData();
      data.push(entry);
      await writeEngagementData(data);

      const engagementSummary = engagedBy.map(p => {
        const parts = [];
        if (p.reacted) parts.push("reacted");
        if (p.comments > 0) parts.push(`${p.comments} comment${p.comments > 1 ? "s" : ""}`);
        return `${p.name} (${parts.join(", ")})`;
      }).join(", ");

      return {
        content: [
          {
            type: "text",
            text: `Engagement logged successfully!\n\nArticle: "${title}"\nURL: ${url}\nEngaged by (${engagedBy.length}): ${engagementSummary}\nLogged at: ${entry.loggedAt}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error logging engagement: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register get_engagement_data tool
server.registerTool(
  "get_engagement_data",
  {
    description: "Retrieve all logged engagement data for analysis. Returns the full history of articles and who engaged with them.",
    inputSchema: {},
  },
  async () => {
    try {
      const data = await readEngagementData();

      if (data.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No engagement data logged yet. Use the log_engagement tool to start tracking.",
            },
          ],
        };
      }

      // Build a summary
      const summary = data.map((entry, i) => {
        const peopleStr = entry.engagedBy.map(p => {
          const parts = [];
          if (p.reacted) parts.push("reacted");
          if (p.comments > 0) parts.push(`${p.comments} comment${p.comments > 1 ? "s" : ""}`);
          return `${p.name} (${parts.join(", ")})`;
        }).join(", ");
        return `${i + 1}. "${entry.title}"\n   URL: ${entry.url}\n   Logged: ${entry.loggedAt}\n   Engaged by (${entry.engagedBy.length}): ${peopleStr}`;
      }).join("\n\n");

      // Aggregate stats
      const engagementCounts = data.map(e => e.engagedBy.length);
      const total = engagementCounts.reduce((a, b) => a + b, 0);
      const avg = (total / data.length).toFixed(1);
      const sorted = [...data].sort((a, b) => b.engagedBy.length - a.engagedBy.length);
      const topArticle = sorted[0];

      return {
        content: [
          {
            type: "text",
            text: [
              `=== Engagement Data (${data.length} articles) ===\n`,
              summary,
              `\n=== Summary ===`,
              `Total engagements logged: ${total}`,
              `Average engagements per article: ${avg}`,
              `Most engaging article: "${topArticle.title}" with ${topArticle.engagedBy.length} people engaging`,
            ].join("\n"),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error reading engagement data: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register resources using registerResource with ResourceTemplate
// Full content resource
server.registerResource(
  "full-content",
  new ResourceTemplate("learning://{id}/full", {
    list: async () => {
      const resources: Array<{ uri: string; name: string; description: string; mimeType: string }> = [];
      for (const [id, content] of contentStore.entries()) {
        resources.push({
          uri: `learning://${id}/full`,
          name: `${content.title} (Full Content)`,
          description: `Complete content of ${content.title}`,
          mimeType: "text/plain",
        });
      }
      return { resources };
    },
  }),
  { title: "Full Content", description: "Complete content of loaded documents" },
  async (uri, { id }) => {
    const contentId = Array.isArray(id) ? id[0] : id;
    const content = contentStore.get(contentId);
    if (!content) {
      throw new Error(`Content not found: ${id}`);
    }
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "text/plain",
          text: `# ${content.title}\n\n${content.fullContent}`,
        },
      ],
    };
  }
);

// Section resource
server.registerResource(
    "section",
    new ResourceTemplate("learning://{id}/section/{sectionIndex}", {
      list: async () => {
        const resources: Array<{ uri: string; name: string; description: string; mimeType: string }> = [];
        for (const [id, content] of contentStore.entries()) {
          content.sections.forEach((section, index) => {
            resources.push({
              uri: `learning://${id}/section/${index}`,
              name: `${content.title} - ${section.title}`,
              description: `Section ${index + 1}: ${section.title}`,
              mimeType: "text/plain",
            });
          });
        }
        return { resources };
      },
    }),
    { title: "Content Section", description: "Individual sections from loaded documents" },
    async (uri, { id, sectionIndex }) => {
      const contentId = Array.isArray(id) ? id[0] : id;
      const sectionIndexStr = Array.isArray(sectionIndex) ? sectionIndex[0] : sectionIndex;
      const content = contentStore.get(contentId);
      if (!content) {
        throw new Error(`Content not found: ${contentId}`);
      }
      const index = parseInt(sectionIndexStr);
      const section = content.sections[index];
      if (!section) {
        throw new Error(`Section ${index} not found`);
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/plain",
            text: `# ${section.title}\n\n${section.content}`,
          },
        ],
      };
    }
);

// Table of contents resource
server.registerResource(
    "toc",
    new ResourceTemplate("learning://{id}/toc", {
      list: async () => {
        const resources: Array<{ uri: string; name: string; description: string; mimeType: string }> = [];
        for (const [id, content] of contentStore.entries()) {
          resources.push({
            uri: `learning://${id}/toc`,
            name: `${content.title} (Table of Contents)`,
            description: `Overview and structure of ${content.title}`,
            mimeType: "text/plain",
          });
        }
        return { resources };
      },
    }),
    { title: "Table of Contents", description: "Overview and structure of loaded documents" },
    async (uri, { id }) => {
      const contentId = Array.isArray(id) ? id[0] : id;
      const content = contentStore.get(contentId);
      if (!content) {
        throw new Error(`Content not found: ${id}`);
      }
      const toc = content.sections
          .map((section, index) =>
              `${"  ".repeat(section.level - 1)}${index + 1}. ${section.title}`
          )
          .join('\n');
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/plain",
            text: `# Table of Contents: ${content.title}\n\n${toc}\n\nTotal sections: ${content.sections.length}`,
          },
        ],
      };
    }
);

// Start the server
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
