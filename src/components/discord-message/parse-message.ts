/**
 * Parse a Discord message of a string and convert it to relevant HTML markup
 * 
 * Use a real parser for this, not just a regex
 * 
 * Goals:
 * - Migrate all images based off of the following:
 * @example <:shrugging:519267805871341568> becomes <img src="https://cdn.discordapp.com/emojis/519267805871341568.png" alt="shrugging">
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
export type TokenEmoji = { type: 'emoji'; name: string; id: string };
export type TokenMention = { type: 'mention'; id: string };
export type TokenCodeInline = { type: 'codeInline'; content: string };
export type TokenCodeBlock = { type: 'codeBlock'; content: string };

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

    if (char === '<' && input[current + 1] === ':') {
      pushBuffer();
      
      // Skip '<:'
      current += 2;
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
      tokens.push({ type: 'emoji', name: emojiName, id: emojiId });
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
      
      // Read until '```'
      while (current < input.length && !(input[current] === '`' && input[current + 1] === '`' && input[current + 2] === '`')) {
        codeBlockContent += input[current];
        current++;
      }
      
      // Skip '```'
      current += 3;
      tokens.push({ type: 'codeBlock', content: codeBlockContent });
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