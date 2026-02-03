# How It Works

## Features

- 📚 Load content from URLs or local files
- 🔍 Automatically parse content into logical sections
- 📖 Access full documents or individual sections as resources
- 🧠 Let Claude summarise sections and quiz you on the material

## Technical Overview

1. **Load Content**: The server fetches content from URLs (converting HTML to markdown) or reads local files
2. **Parse Sections**: Content is automatically split into sections based on headings
3. **Expose Resources**: Each section becomes an MCP resource that Claude can read
4. **Natural Interaction**: You chat with Claude normally, and it uses the resources to help you learn

## Content Loading Process

- **URLs**: Fetches HTML, removes navigation/footer/scripts, converts to markdown
- **Files**: Reads local markdown, text, or HTML files
- HTML files are automatically converted to clean markdown
- Content is parsed into sections based on markdown headings (# to ######)

## Available Tools

- `load_content`: Load content from a URL or file path
- `list_loaded_content`: See what content is currently available
- `remove_content`: Remove content you're done studying

## Resource URIs

When content is loaded with ID `article1`, you get:
- `learning://article1/full` - Complete content
- `learning://article1/toc` - Table of contents
- `learning://article1/section/0` - First section
- `learning://article1/section/1` - Second section
- etc.

## Supported Formats

- **URLs**: Any web page (HTML converted to markdown)
- **Local files**:
  - Markdown (`.md`)
  - Text files (`.txt`)
  - HTML files (`.html`, `.htm`)
  - Any text-based format
