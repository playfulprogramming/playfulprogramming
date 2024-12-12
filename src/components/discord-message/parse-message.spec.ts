import { describe, it, expect } from 'vitest';
import { parseDiscordMessage } from './parse-message';

describe('parseDiscordMessage', () => {
  const mockLookupUserName = async (id: string) => {
    const users: { [key: string]: string } = {
      '270063754576789504': 'crutchcorn (Corbin Crutchley)'
    };
    return users[id] || 'unknown';
  };

  it('should handle plain text', async () => {
    const input = 'Hello, world!';
    expect(await parseDiscordMessage(input, { lookupUserName: mockLookupUserName })).toBe('Hello, world!');
  });

  it('should parse Discord emoji', async () => {
    const input = '<:shrugging:519267805871341568>';
    expect(await parseDiscordMessage(input, { lookupUserName: mockLookupUserName })).toBe(
      '<img src="https://cdn.discordapp.com/emojis/519267805871341568.png" alt="shrugging">'
    );
  });

  it('should handle mixed text and emoji', async () => {
    const input = 'Hello <:shrugging:519267805871341568> world';
    expect(await parseDiscordMessage(input, { lookupUserName: mockLookupUserName })).toBe(
      'Hello <img src="https://cdn.discordapp.com/emojis/519267805871341568.png" alt="shrugging"> world'
    );
  });

  it('should escape HTML in text content', async () => {
    const input = 'Hello <script>alert("xss")</script>';
    expect(await parseDiscordMessage(input, { lookupUserName: mockLookupUserName })).toBe(
      'Hello &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('should handle multiple emojis', async () => {
    const input = '<:emoji1:123> text <:emoji2:456>';
    expect(await parseDiscordMessage(input, { lookupUserName: mockLookupUserName })).toBe(
      '<img src="https://cdn.discordapp.com/emojis/123.png" alt="emoji1"> text <img src="https://cdn.discordapp.com/emojis/456.png" alt="emoji2">'
    );
  });

  it('should parse Discord mentions', async () => {
    const input = '<@270063754576789504>';
    expect(await parseDiscordMessage(input, { lookupUserName: mockLookupUserName })).toBe('@crutchcorn (Corbin Crutchley)');
  });

  it('should handle mixed text and mentions', async () => {
    const input = 'Hello <@270063754576789504> world';
    expect(await parseDiscordMessage(input, { lookupUserName: mockLookupUserName })).toBe('Hello @crutchcorn (Corbin Crutchley) world');
  });

  it('should handle mixed text, emoji, and mentions', async () => {
    const input = 'Hello <:shrugging:519267805871341568> <@270063754576789504> world';
    expect(await parseDiscordMessage(input, { lookupUserName: mockLookupUserName })).toBe(
      'Hello <img src="https://cdn.discordapp.com/emojis/519267805871341568.png" alt="shrugging"> @crutchcorn (Corbin Crutchley) world'
    );
  });
});
