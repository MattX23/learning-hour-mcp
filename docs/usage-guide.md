# Usage Guide & Prompt Library

Once the server is running in Claude Desktop, you can interact with it naturally through Claude. Here's a comprehensive guide to getting the most out of it.

## 1. Loading Content

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

## 2. Content Analysis

**Summarise all sections:**
```
Can you summarise each section and show me?
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

## 3. Study Materials Creation

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

## 4. Content Transformation

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

## 5. Research & Synthesis

**Literature review:**
```
I've loaded multiple research articles. Create a literature review that:
- Summarises each source
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

## 6. Content Management

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

## 7. Specific Section Work

**Focus on one section:**
```
Summarise the first section of the article
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

## 8. Practical Applications

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

## 9. Multi-Source Synthesis

**Comprehensive report:**
```
I've loaded [X] articles on [topic]. Create a comprehensive report that:
- Synthesises information from all sources
- Organises by theme rather than by source
- Includes citations for key claims
- Provides a balanced perspective
```

```
Read the full content and create a study guide
```

## 10. Learning Path Creation

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

## Best Practices

1. **Always check what's loaded** before starting complex tasks
2. **Use descriptive IDs** when loading multiple pieces of content
3. **Load related content together** for better synthesis
4. **Reference specific section numbers** when you know them
5. **Request structured outputs** (markdown tables, lists, etc.) for clarity
6. **Combine with other tools** - the content is in markdown, so you can create documents, presentations, etc.

## Tips for Optimal Use

### For Research:
- Load multiple sources before asking for synthesis
- Use comparison prompts to find consensus and conflicts
- Create structured outputs for easy reference
- Claude can compare sections or synthesise information across whole documents

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

## Example Session

```
You: Load https://en.wikipedia.org/wiki/Photosynthesis

Claude: I'll load that article for you.
[Uses load_content tool]
Successfully loaded "Photosynthesis" with 12 sections.

You: Give me an overview of what's in this article

Claude: [Reads the table of contents resource]
This article on photosynthesis covers...

You: Summarise the section on light-dependent reactions

Claude: [Reads specific section resource and summarises]
The light-dependent reactions section explains...

You: Quiz me on that section

Claude: [Creates quiz questions based on the section content]
Great! Here are 3 questions to test your understanding:
1. What is the role of chlorophyll in...
```
