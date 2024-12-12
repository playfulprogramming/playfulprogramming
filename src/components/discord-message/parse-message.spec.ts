import { describe, it, expect } from 'vitest';
import { tokenizeMessage, Token } from './parse-message';

describe('tokenizeMessage', () => {
  it('should handle plain text', () => {
    const input = 'Hello, world!';
    const expected: Token[] = [{ type: 'text', content: 'Hello, world!' }];
    expect(tokenizeMessage(input)).toEqual(expected);
  });

  it('should parse Discord emoji', () => {
    const input = '<:shrugging:519267805871341568>';
    const expected: Token[] = [{ type: 'emoji', name: 'shrugging', id: '519267805871341568' }];
    expect(tokenizeMessage(input)).toEqual(expected);
  });

  it('should handle mixed text and emoji', () => {
    const input = 'Hello <:shrugging:519267805871341568> world';
    const expected: Token[] = [
      { type: 'text', content: 'Hello ' },
      { type: 'emoji', name: 'shrugging', id: '519267805871341568' },
      { type: 'text', content: ' world' }
    ];
    expect(tokenizeMessage(input)).toEqual(expected);
  });

  it('should escape HTML in text content', () => {
    const input = 'Hello <script>alert("xss")</script>';
    const expected: Token[] = [{ type: 'text', content: 'Hello <script>alert("xss")</script>' }];
    expect(tokenizeMessage(input)).toEqual(expected);
  });

  it('should handle multiple emojis', () => {
    const input = '<:emoji1:123> text <:emoji2:456>';
    const expected: Token[] = [
      { type: 'emoji', name: 'emoji1', id: '123' },
      { type: 'text', content: ' text ' },
      { type: 'emoji', name: 'emoji2', id: '456' }
    ];
    expect(tokenizeMessage(input)).toEqual(expected);
  });

  it('should parse Discord mentions', () => {
    const input = '<@270063754576789504>';
    const expected: Token[] = [{ type: 'mention', id: '270063754576789504' }];
    expect(tokenizeMessage(input)).toEqual(expected);
  });

  it('should handle mixed text and mentions', () => {
    const input = 'Hello <@270063754576789504> world';
    const expected: Token[] = [
      { type: 'text', content: 'Hello ' },
      { type: 'mention', id: '270063754576789504' },
      { type: 'text', content: ' world' }
    ];
    expect(tokenizeMessage(input)).toEqual(expected);
  });

  it('should handle mixed text, emoji, and mentions', () => {
    const input = 'Hello <:shrugging:519267805871341568> <@270063754576789504> world';
    const expected: Token[] = [
      { type: 'text', content: 'Hello ' },
      { type: 'emoji', name: 'shrugging', id: '519267805871341568' },
      { type: 'text', content: ' ' },
      { type: 'mention', id: '270063754576789504' },
      { type: 'text', content: ' world' }
    ];
    expect(tokenizeMessage(input)).toEqual(expected);
  });

  it('should parse inline code samples', () => {
    const input = 'This is `inline code` example';
    const expected: Token[] = [
      { type: 'text', content: 'This is ' },
      { type: 'codeInline', content: 'inline code' },
      { type: 'text', content: ' example' }
    ];
    expect(tokenizeMessage(input)).toEqual(expected);
  });

  it('should parse code blocks', () => {
    const input = 'Here is a code block:\n```js\nlet x = 5;\n```';
    const expected: Token[] = [
      { type: 'text', content: 'Here is a code block:\n' },
      { type: 'codeBlock', content: 'js\nlet x = 5;\n' }
    ];
    expect(tokenizeMessage(input)).toEqual(expected);
  });

  it('should handle mixed text, inline code, and code blocks', () => {
    const input = 'Text `inline code` more text\n```js\nlet x = 5;\n``` end';
    const expected: Token[] = [
      { type: 'text', content: 'Text ' },
      { type: 'codeInline', content: 'inline code' },
      { type: 'text', content: ' more text\n' },
      { type: 'codeBlock', content: 'js\nlet x = 5;\n' },
      { type: 'text', content: ' end' }
    ];
    expect(tokenizeMessage(input)).toEqual(expected);
  });
});
