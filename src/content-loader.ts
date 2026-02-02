import { readFile } from 'fs/promises'
import { load } from 'cheerio';
import fetch from 'node-fetch';
import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

export async function loadContent(source: string): Promise<{
  title: string;
  content: string;
  isUrl: boolean;
}> {
  const isUrl = source.startsWith('http://') || source.startsWith('https://');

  if (isUrl) {
    return await loadFromUrl(source);
  } else {
    return await loadFromFile(source);
  }
}

async function loadFromUrl(url: string): Promise<{
  title: string;
  content: string;
  isUrl: boolean;
}> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const $ = load(html);

  // Remove script and style elements
  $('script, style, nav, footer, header').remove();

  // Try to find the main content
  let mainContent = $('article, main, .content, .post, .article').first();
  if (mainContent.length === 0) {
    mainContent = $('body');
  }

  // Extract title
  let title = $('h1').first().text().trim();
  if (!title) {
    title = $('title').text().trim();
  }
  if (!title) {
    title = new URL(url).hostname;
  }

  // Convert HTML to Markdown
  const htmlContent = mainContent.html() || '';
  const markdown = turndownService.turndown(htmlContent);

  return {
    title,
    content: markdown,
    isUrl: true,
  };
}

async function loadFromFile(filepath: string): Promise<{
  title: string;
  content: string;
  isUrl: boolean;
}> {
  try {
    const content = await readFile(filepath, 'utf-8');

    // Extract title from filename
    const filename = filepath.split('/').pop() || 'Document';
    const title = filename.replace(/\.[^/.]+$/, ''); // Remove extension

    // If it's an HTML file, convert to markdown
    if (filepath.endsWith('.html') || filepath.endsWith('.htm')) {
      const $ = load(content);
      $('script, style, nav, footer, header').remove();

      let pageTitle = $('h1').first().text().trim();
      if (!pageTitle) {
        pageTitle = $('title').text().trim();
      }

      const htmlContent = $('body').html() || content;
      const markdown = turndownService.turndown(htmlContent);

      return {
        title: pageTitle || title,
        content: markdown,
        isUrl: false,
      };
    }

    // For markdown, text, or other files, return as-is
    return {
      title,
      content,
      isUrl: false,
    };
  } catch (error) {
    throw new Error(`Failed to read file: ${error instanceof Error ? error.message : String(error)}`);
  }
}
