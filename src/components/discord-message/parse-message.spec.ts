import { describe, it, expect } from 'vitest';
import { parseDiscordMessage } from './parse-message';

describe('parseDiscordMessage', () => {
  it('should handle plain text', () => {
    const input = 'Hello, world!';
    expect(parseDiscordMessage(input)).toBe('Hello, world!');
  });

  it('should parse Discord emoji', () => {
    const input = '<:shrugging:519267805871341568>';
    expect(parseDiscordMessage(input)).toBe(
      '<img src="https://cdn.discordapp.com/emojis/519267805871341568.png" alt="shrugging">'
    );
  });

  it('should handle mixed text and emoji', () => {
    const input = 'Hello <:shrugging:519267805871341568> world';
    expect(parseDiscordMessage(input)).toBe(
      'Hello <img src="https://cdn.discordapp.com/emojis/519267805871341568.png" alt="shrugging"> world'
    );
  });

  it('should escape HTML in text content', () => {
    const input = 'Hello <script>alert("xss")</script>';
    expect(parseDiscordMessage(input)).toBe(
      'Hello &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('should handle multiple emojis', () => {
    const input = '<:emoji1:123> text <:emoji2:456>';
    expect(parseDiscordMessage(input)).toBe(
      '<img src="https://cdn.discordapp.com/emojis/123.png" alt="emoji1"> text <img src="https://cdn.discordapp.com/emojis/456.png" alt="emoji2">'
    );
  });
});
