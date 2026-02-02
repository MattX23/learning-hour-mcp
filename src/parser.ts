interface Section {
  title: string;
  content: string;
  level: number;
}

export function parseIntoSections(content: string): Section[] {
  const lines = content.split('\n');
  const sections: Section[] = [];

  let currentSection: Section | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    // Check if line is a heading (markdown format)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      // Save previous section if it exists
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        sections.push(currentSection);
      }

      // Start new section
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();

      currentSection = {
        title,
        content: '',
        level,
      };
      currentContent = [];
    } else if (currentSection) {
      // Add content to current section
      currentContent.push(line);
    } else {
      // Content before first heading - create an "Introduction" section
      if (sections.length === 0 && line.trim()) {
        currentSection = {
          title: 'Introduction',
          content: '',
          level: 1,
        };
        currentContent = [line];
      }
    }
  }

  // Don't forget the last section
  if (currentSection) {
    currentSection.content = currentContent.join('\n').trim();
    sections.push(currentSection);
  }

  // If no sections were found, create a single section with all content
  if (sections.length === 0) {
    sections.push({
      title: 'Content',
      content: content.trim(),
      level: 1,
    });
  }

  return sections;
}
