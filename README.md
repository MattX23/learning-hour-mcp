# Learning MCP Server

An MCP (Model Context Protocol) server that helps you learn from articles and documents by organizing content into sections and making it accessible to Claude for summarization and quiz generation.

## Features

- 📚 Load content from URLs or local files
- 🔍 Automatically parse content into logical sections
- 📖 Access full documents or individual sections as resources
- 🎯 Perfect for study sessions with Claude
- 🧠 Let Claude summarize sections and quiz you on the material

## Project Structure

```
learning-mcp-server/
├── src/
│   ├── index.ts           # Main server with tools and resources
│   ├── content-loader.ts  # Fetch content from URLs/files
│   └── parser.ts          # Parse content into sections
├── build/                 # Compiled JavaScript (generated)
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
      "command": "node",
      "args": ["/absolute/path/to/learning-mcp-server/build/index.js"]
    }
  }
}
```

Replace `/absolute/path/to/learning-mcp-server` with the actual path to your project.

After updating the config, restart Claude Desktop.

---

## How It Works

### Technical Overview

1. **Load Content**: The server fetches content from URLs (converting HTML to markdown) or reads local files
2. **Parse Sections**: Content is automatically split into sections based on headings
3. **Expose Resources**: Each section becomes an MCP resource that Claude can read
4. **Natural Interaction**: You chat with Claude normally, and it uses the resources to help you learn

### Content Loading Process

- **URLs**: Fetches HTML, removes navigation/footer/scripts, converts to markdown
- **Files**: Reads local markdown, text, or HTML files
- HTML files are automatically converted to clean markdown
- Content is parsed into sections based on markdown headings (# to ######)

### Available Tools

- `load_content`: Load content from a URL or file path
- `list_loaded_content`: See what content is currently available
- `remove_content`: Remove content you're done studying

### Resource URIs

When content is loaded with ID `article1`, you get:
- `learning://article1/full` - Complete content
- `learning://article1/toc` - Table of contents
- `learning://article1/section/0` - First section
- `learning://article1/section/1` - Second section
- etc.

Claude accesses these automatically when you ask questions about the content.

## Supported Formats

- **URLs**: Any web page (HTML converted to markdown)
- **Local files**:
  - Markdown (`.md`)
  - Text files (`.txt`)
  - HTML files (`.html`, `.htm`)
  - Any text-based format

---

## Usage Guide & Prompt Library

Once the server is running in Claude Desktop, you can interact with it naturally through Claude. Here's a comprehensive guide to getting the most out of it.

### 1. Loading Content

**From a URL:**
```
Load this article for me to study: https://example.com/article
```

**From a file:**
```
Load the file ~/Documents/study-notes.md so I can study it
```

**With a custom ID:**
```
Load https://example.com/long-article and call it "article1"
```

**Load multiple articles:**
```
Load these articles for comparison:
1. https://example.com/article1
2. https://example.com/article2
3. https://example.com/article3
```

### 2. Content Analysis

**Summarize all sections:**
```
Can you summarize each section and show me?
```

**Detailed analysis:**
```
Analyze the loaded content and create:
- An executive summary
- Key points from each section
- Main themes and arguments
```

**Compare multiple sources:**
```
Compare the perspectives in [content-id-1] and [content-id-2] on [topic].
Highlight where they agree and disagree.
```

**Extract key information:**
```
From the loaded content, extract all:
- Statistics and data points
- Key quotes
- Action items
- Technical specifications
```

**Get overview:**
```
Give me a table of contents for what I just loaded
```

```
What are the main points in section 3?
```

### 3. Study Materials Creation

**Create study notes:**
```
Create comprehensive study notes including:
- Main concepts with explanations
- Important terms and definitions
- Examples from each section
```

**Generate flashcards:**
```
Create a set of flashcards covering:
- Key concepts (question/answer format)
- Important definitions
- Critical facts
```

**Create a quiz:**
```
Generate a 10-question quiz with:
- Multiple choice questions
- Short answer questions
- An answer key
```

```
Quiz me on the material from section 2
```

```
Create 5 multiple choice questions about the article
```

```
Test my understanding of the key concepts
```

**Make a mind map outline:**
```
Create a hierarchical outline/mind map structure showing:
- Main topics
- Subtopics
- Key supporting points
```

### 4. Content Transformation

**Convert to different format:**
```
Transform the content into:
- A slide presentation outline
- A one-page cheat sheet
- An infographic layout
- A blog post
```

**Simplify complex content:**
```
Rewrite this at a [grade level] reading level,
maintaining all key information but making it more accessible.
```

**Create teaching materials:**
```
Create a lesson plan including:
- Learning objectives
- Key teaching points
- Discussion questions
- Activities or exercises
```

### 5. Research & Synthesis

**Literature review:**
```
I've loaded multiple research articles. Create a literature review that:
- Summarizes each source
- Identifies common themes
- Notes conflicting findings
- Suggests areas for further research
```

**Evidence collection:**
```
From the loaded content, compile all evidence related to [claim/hypothesis]:
- Supporting evidence
- Contradicting evidence
- Neutral/contextual information
```

**Create annotated bibliography:**
```
Create an annotated bibliography for all loaded content, including:
- Full citation
- Summary of content
- Key takeaways
- Relevance to [topic]
```

**Meta-analysis:**
```
Analyze all loaded content and identify:
- Consensus views
- Controversial points
- Gaps in coverage
- Emerging trends
```

### 6. Content Management

**Check what's loaded:**
```
What content do I have loaded?
```

**List all sections:**
```
Show me all the section titles
```

**Remove content:**
```
Remove [content-id] from loaded content
```

### 7. Specific Section Work

**Focus on one section:**
```
Summarize the first section of the article
```

```
Take section [X] and:
- Provide a detailed explanation
- Identify any ambiguous points
- Suggest additional resources
```

**Section comparison:**
```
Compare section [X] from [content-id-1] with section [Y] from [content-id-2]
```

**Expand on section:**
```
Take section [X] and expand it into a full article with:
- More detailed explanations
- Additional examples
- Practical applications
```

### 8. Practical Applications

**Create action plan:**
```
Based on the loaded content, create an implementation action plan with:
- Specific steps
- Timeline
- Required resources
- Success metrics
```

**Generate examples:**
```
From the concepts covered, generate 5 practical examples
showing how to apply these ideas in [context]
```

**Problem-solving:**
```
Using the information in the loaded content, help me solve this problem:
[problem description]
```

### 9. Multi-Source Synthesis

**Comprehensive report:**
```
I've loaded [X] articles on [topic]. Create a comprehensive report that:
- Synthesizes information from all sources
- Organizes by theme rather than by source
- Includes citations for key claims
- Provides a balanced perspective
```

```
Read the full content and create a study guide
```

### 10. Learning Path Creation

**Progressive learning guide:**
```
Create a progressive learning path that:
- Orders topics from basic to advanced
- Suggests which content to study first
- Identifies prerequisites
- Recommends practice exercises
```

**Skill development plan:**
```
Create a skill development plan including:
- Core competencies to develop
- Learning milestones
- Practice activities
- Assessment checkpoints
```

---

## Best Practices

1. **Always check what's loaded** before starting complex tasks
2. **Use descriptive IDs** when loading multiple pieces of content
3. **Load related content together** for better synthesis
4. **Reference specific section numbers** when you know them
5. **Request structured outputs** (markdown tables, lists, etc.) for clarity
6. **Combine with other tools** - the content is in markdown, so you can create documents, presentations, etc.

---

## Tips for Optimal Use

### For Research:
- Load multiple sources before asking for synthesis
- Use comparison prompts to find consensus and conflicts
- Create structured outputs for easy reference
- Claude can compare sections or synthesize information across whole documents

### For Learning:
- Load content once, then ask multiple questions about it
- Start with summaries, then dig deeper into specific sections
- Create multiple types of study materials (notes, flashcards, quizzes)
- Use progressive complexity in your requests
- Ask for table of contents to see the structure before diving in
- Request different question formats: multiple choice, short answer, true/false, etc.

### For Content Creation:
- Load source material first
- Request outlines before full content
- Specify your target audience and format

### For Analysis:
- Be specific about what you want to analyze
- Request structured outputs with clear sections
- Ask for citations/references to specific sections

---

## Example Session

```
You: Load https://en.wikipedia.org/wiki/Photosynthesis

Claude: I'll load that article for you.
[Uses load_content tool]
Successfully loaded "Photosynthesis" with 12 sections.

You: Give me an overview of what's in this article

Claude: [Reads the table of contents resource]
This article on photosynthesis covers...

You: Summarize the section on light-dependent reactions

Claude: [Reads specific section resource and summarizes]
The light-dependent reactions section explains...

You: Quiz me on that section

Claude: [Creates quiz questions based on the section content]
Great! Here are 3 questions to test your understanding:
1. What is the role of chlorophyll in...
```

---

## Development

Watch for changes during development:
```bash
npm run watch
```

---

## Troubleshooting

**Server not appearing in Claude Desktop:**
- Check the config file path is correct
- Verify the absolute path to `build/index.js`
- Restart Claude Desktop after config changes
- Check Claude Desktop logs for errors

**Content not loading:**
- For URLs: Check your internet connection
- For files: Verify the file path is correct and accessible
- Check the server logs (stderr) for error messages

**Sections not parsing correctly:**
- The parser looks for markdown headings (`#`, `##`, etc.)
- If your content doesn't have headings, it will be treated as one section
- HTML files are converted to markdown first

---

## License

MIT
