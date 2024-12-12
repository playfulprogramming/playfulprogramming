/**
 * Parse a Discord message of a string and convert it to relevant HTML markup
 * 
 * Use a real parser for this, not just a regex
 * 
 * Goals:
 * - Migrate all images based off of the following:
 * @example <:shrugging:519267805871341568> becomes <img src="https://cdn.discordapp.com/emojis/519267805871341568.png" alt="shrugging">
 * @example <a:dancing_penguin:1013090009756209234> becomes <img src="https://cdn.discordapp.com/emojis/1013090009756209234.gif" alt="dancing_penguin">
 * - Migrate all mentions to a username based off of the following:
 * @example <@270063754576789504> becomes "@crutchcorn (Corbin Crutchley)"
 * - Inline code samples should be wrapped in <code> tags
 * @example `let x = 5;` becomes <code>let x = 5;</code>
 * - Code blocks should be wrapped in <pre> tags
 * @example
 *     ```js
 *     let x = 5;
 *     ```
 *     becomes
 *     <pre><code>let x = 5;</code></pre>
 * - All other text should be left as is, but escaped to prevent XSS
 */

export type TokenText = { type: 'text'; content: string };
export type TokenEmoji = { 
  type: 'emoji'; 
  name: string; 
  id: string;
  animated?: boolean;
};
export type TokenMention = { type: 'mention'; id: string };
export type TokenCodeInline = { type: 'codeInline'; content: string };
export type TokenCodeBlock = { 
  type: 'codeBlock'; 
  content: string;
  lang?: string;
};

export type Token = 
  | TokenText
  | TokenEmoji
  | TokenMention
  | TokenCodeInline
  | TokenCodeBlock

export function tokenizeMessage(input: string): Token[] {
  const tokens: Token[] = [];
  let current = 0;
  let buffer = '';

  function pushBuffer() {
    if (buffer) {
      tokens.push({ type: 'text', content: buffer });
      buffer = '';
    }
  }

  while (current < input.length) {
    const char = input[current];

    if (char === '<' && (input[current + 1] === ':' || (input[current + 1] === 'a' && input[current + 2] === ':'))) {
      pushBuffer();
      
      // Check if animated
      const isAnimated = input[current + 1] === 'a';
      
      // Skip '<:' or '<a:'
      current += isAnimated ? 3 : 2;
      let emojiName = '';
      
      // Read until ':'
      while (current < input.length && input[current] !== ':') {
        emojiName += input[current];
        current++;
      }
      
      // Skip ':'
      current++;
      let emojiId = '';
      
      // Read until '>'
      while (current < input.length && input[current] !== '>') {
        emojiId += input[current];
        current++;
      }
      
      // Skip '>'
      current++;
      tokens.push({ 
        type: 'emoji', 
        name: emojiName, 
        id: emojiId,
        ...(isAnimated ? { animated: true } : {})
      });
    } else if (char === '<' && input[current + 1] === '@') {
      pushBuffer();
      
      // Skip '<@'
      current += 2;
      let mentionId = '';
      
      // Read until '>'
      while (current < input.length && input[current] !== '>') {
        mentionId += input[current];
        current++;
      }
      
      // Skip '>'
      current++;
      tokens.push({ type: 'mention', id: mentionId });
    } else if (char === '`' && input[current + 1] === '`' && input[current + 2] === '`') {
      pushBuffer();
      
      // Skip '```'
      current += 3;
      let codeBlockContent = '';
      
      // Get the first line
      let firstLine = '';
      while (current < input.length && input[current] !== '\n' && !(input[current] === '`' && input[current + 1] === '`' && input[current + 2] === '`')) {
        firstLine += input[current];
        current++;
      }

      // Skip newline if present
      if (input[current] === '\n') {
        current++;
      }
      
      // Read until '```'
      while (current < input.length && !(input[current] === '`' && input[current + 1] === '`' && input[current + 2] === '`')) {
        codeBlockContent += input[current];
        current++;
      }

      // Skip '```'
      current += 3;

      // Check if first line is a clean language identifier
      const token: TokenCodeBlock = { type: 'codeBlock', content: codeBlockContent.replace(/\n$/, '') };
      if (firstLine && !firstLine.trim().includes(' ')) {
        token.lang = firstLine;
      } else if (firstLine) {
        token.content = firstLine + '\n' + token.content;
      }

      tokens.push(token);
    } else if (char === '`') {
      pushBuffer();
      
      // Skip '`'
      current++;
      let codeInlineContent = '';
      
      // Read until '`'
      while (current < input.length && input[current] !== '`') {
        codeInlineContent += input[current];
        current++;
      }
      
      // Skip '`'
      current++;
      tokens.push({ type: 'codeInline', content: codeInlineContent });
    } else {
      buffer += char;
      current++;
    }
  }

  pushBuffer();
  return tokens;
}