# Set-up

## Project Structure

```
learning-hour-mcp/
├── src/
│   ├── index.ts           # Main server with tools and resources.
│   ├── content-loader.ts  # Fetch content from URLs/files.
│   └── parser.ts          # Parse content into sections.
├── build/
├── docs/
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

## Configuration in Claude Desktop

Add this to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "learning": {
      "command": "/absolute/path/to/node/version",
      "args": ["/absolute/path/to/learning-hour-mcp/build/index.js"]
    }
  }
}
```

Replace `/absolute/path/to/learning-hour-mcp` with the actual path to your project.

After updating the config, restart Claude Desktop.

## License

MIT
