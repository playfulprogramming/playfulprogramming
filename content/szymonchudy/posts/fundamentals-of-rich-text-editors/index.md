---
{
	title: "Fundamentals of Rich Text Editors",
	description: "The mental model I wish I had when I started working with WYSIWYG editors: document models, transactions, and custom nodes explained in 10 minutes.",
	authors: ["szymonchudy"],
	tags: ["javascript", "react", "html", "webdev"],
	originalLink: "https://szymonchudy.com/blog/fundamentals-of-rich-text-editors",
    published: "2025-12-19T13:45:00.284Z",
    license: 'cc-by-nc-nd-4'
}
---

## Preface

Rich text editors are everywhere: blogs and CMS dashboards, documentation tools, chat windows - you name it. We interact with them constantly, and yet most frontend engineers only discover how complex they are when they try to implement even a small piece of rich text functionality.

What seems like a simple problem - _let users type, style text, and paste things_ - turns into a stream of edge cases, broken cursors, inconsistent DOM output, and browser quirks.

The good news is that every modern editor, no matter which library you pick, is built on the same set of fundamental ideas. Understanding them once gives you the vocabulary to make sense of all of them: Tiptap, ProseMirror, Lexical, Slate, CKEditor and beyond.

This article aims to give you that foundation allowing to build a mental model I wish I had when I first started working with rich text editors.

## What the WYSIWYG

_WYSIWYG_ is an acronym that typically appears alongside _RTE_, which stands for _Rich Text Editor_. As per [Wikipedia](https://en.wikipedia.org/wiki/WYSIWYG):

> **WYSIWYG (What You See Is What You Get**) is software that allows content to be edited in a form that resembles its appearance when printed or displayed as a finished product.

So the promise here is simple and self-explanatory: what you see while editing is what your readers will see. Bold text looks bold. Headings are large. Lists have bullets. Images and videos appear inline. User mentions like `@szymon` are clickable and interactive.

It's intuitive because it mirrors the mental model we developed using word processors. No markup languages, no preview modes, just direct manipulation of content that can include not just formatting, but embedded media and custom interactive elements.

However, building similar experience for the web platform is far from simple. Let's start with what the browser gives us.

## Why Browser Isn't Enough

Everything starts with a single browser feature.

```html
<div contenteditable="true">Hello!</div>
```

`contenteditable` allows the user to type directly into the DOM. The browser handles cursor movement, selection, basic formatting commands, and pasting. For a quick prototype, this feels almost magical - a text editor "for free."

But the moment you try to build a real product on it, the cracks appear.

Paste a paragraph from Google Docs and you'll get dozens of nested spans with inline styles and class names that have nothing to do with your content. Try deleting a word that's partially bolded - depending on which browser you're using, you might end up with two separate text nodes, a merged node with inconsistent styling, or an empty formatting tag just hanging around. Press undo a few times and you'll find that Chrome remembers different things than Firefox.

The fundamental issue here? The DOM is not a stable, semantic representation of your content. It's too permissive and too irregular. The browser will accept almost any HTML structure, even if it makes no semantic sense. A paragraph can contain another paragraph. A bold tag can wrap half a word, leaving fragmented text nodes. Without constraints, the DOM structure drifts into unpredictable territory with every user interaction.

That's why modern editors work by letting the browser render text, not define its meaning.

## Editor's True Source of Truth

Usually editors replace the DOM with its own internal representation - a _document model_ that describes the structure of your content.

| **Side note:** The _document model_ refers to the editor's content structure, not the browser's _Document **Object** Model_. I know it's a bit confusing terminology, but this distinction is important.

At a high level, it looks something like this:

```
doc
├─ paragraph
│    ├─ text("Hello ", [])
│    └─ text("world", ["bold"])
├─ mention(id="U123", name="szymon")
└─ paragraph
     └─ text("Another paragraph", [])
```

This model consists of:

- **Nodes** - paragraphs, headings, lists, images, embeds
- **Inline nodes** - text, links, mentions, placeholders
- **Marks** - bold, italic, underline
- **Attributes** - metadata like URLs or IDs
- **Schema rules** - Describing which nodes can appear where

The schema is what keeps everything logical. A list can only contain list items. A list item can contain paragraphs or nested lists, but not headings. These constraints prevent malformed structures from ever forming, etc. The key takeaway here is:

> The document model is the source of truth. The DOM is just a projection of it.

## The Selection Model

The browser's selection API is based on DOM nodes and offsets: "offset 5 in the third text node inside the second div." But what happens when React re-renders and replaces that div? Your cursor jumps. The user is confused.

Instead, rich text editors track selection semantically. Rather than saying "the cursor is at offset 5 in this specific DOM text node," the editor says "the cursor is at position 23 in the second paragraph." When React re-renders and swaps out DOM nodes, the editor can reconstruct exactly where the cursor belongs by looking at the document structure - it knows position 23 is still position 23, even if the underlying DOM nodes got replaced.

An editor tracks three types of selections:

- **Cursor** - a collapsed range at a single position
- **Text range** - spanning multiple characters or nodes
- **Node selection** - targeting an entire element like an image

That last one is crucial for custom nodes. In example when you click on a Slack mention, the entire `@szymon` gets selected as a unit. You can't put your cursor in the middle and edit it character by character.

## Transactions

### How Editors Change State

Typing into a modern editor does not directly modify the DOM. Instead, editors express every change as a _transaction_ (sometimes called an _operation_). For example:

```js
// typing "X" becomes
insertText("X", position)

// pressing Backspace becomes
deleteRange(from, to)

// applying bold becomes
addMark("bold", from, to)

// inserting a mention becomes
insertNode({ type: "mention", attrs… })
```

Each transaction bundles two things: a change to the document model and a change to the selection. After you insert _X_, your cursor needs to move forward one position. After you insert a mention, your cursor should appear right after it.
This approach makes everything better:

- **Undo/redo becomes trivial** - just store the inverse of each transaction
- **Updates are deterministic** - same input always produces same output
- **Collaborative editing works** - other users' changes can be replayed as transactions
- **Rendering is predictable** - the editor always knows exactly what changed

So tf you're familiar with React state management patterns...

> Think of transactions as tiny, explicit reducers that describe what happened.

### Rendering

Once a transaction produces a new editor state, the editor updates the DOM to match the document model. But instead of re-rendering everything, editors compute the minimal set of required changes.

When you type a character, the editor finds the specific text node that needs updating and modifies just that node. When you apply bold to a word, it wraps only that word. When you delete a paragraph, it removes only that paragraph's DOM node.
This is crucial because:

- DOM operations are expensive
- Naive updates break the cursor or cause visual jumps
- The browser needs help maintaining selection during updates

This is why you can't _just use React for everything_.

React's reconciliation isn't optimized for cursor-preserving updates inside editable regions. The editor needs fine-grained control over what changes and when.

## Interpreting User Intent

When a user interacts with a WYSIWYG editor, they're expressing intent, not performing raw DOM operations. Editors translate that intent into transactions.

Any Notion lovers out there? Asking, because I think they master the part of interpreting user intent better than anyone else.

When you type `# ` _(notice a space after the hash)_ at the start of a line, suddenly the text becomes a heading. That's an input rule. The editor watches what you type and looks for patterns. When it understands what you mean, it deletes those characters and changes the block into a heading.

Or press `Enter` inside a list. The browser's default would insert a line break. But you want a new list item. The editor intercepts the keypress, checks what block you're in, and runs the appropriate command. At the end of an empty list item? Break out of the list. In the middle of a list item? Split it intelligently.

The options are basically limitless.

`@` opens an autocomplete panel. `/` gives you access to commands. `Backspace` near an atomic node selects it first before deleting it. Each of these behaviors is defined in terms of the document model and user intent, not raw DOM manipulations. And the list can go on and on.

This layer is where the editor truly becomes a product.

It's also the layer where browser inconsistencies are abstracted away. Instead of handling Chrome, Firefox, and Safari differently, the editor defines behavior in terms of the document model and lets the rendering layer sort out the details.

---

Some intents seem to be well-established UX patterns. We expect text to be bold when pressing `Cmd+B`, italic when pressing `Cmd+I`, and underlined when pressing `Cmd+U`. But what about more specialized elements?

## Custom Inline Nodes

If we are talking about building rich text editors, there is a high chance you need to build something domain-specific.

For us at Lokalise, that meant building an editor that could handle translation strings with placeholders like `{username}` or `{date}`. These placeholders cannot be broken, styled, or partially selected. They need to behave as atomic units within the text. This is where custom inline nodes come into play.

Though for our discussion, let's stick to something more universal.

### Slack-style Mentions

Let's talk about Slack-style mentions like "@szymon".

At first glance, you might think: just wrap the text in a <span> with a special class. But here's the thing: it's not just styled text. It's a semantic object with meaning and behavior.
To make mentions work properly, you first need to define them in your editor's schema. Here's what a mention node definition could look like:

```js
{
  name: 'mention',
  inline: true,
  atom: true,
  attrs: {
    id: {},
    name: {}
  }
}
```

The `inline: true` means it flows within text (like bold or just span). The `atom: true` is the key part - it tells the editor this node is indivisible. You can't put your cursor in the middle of it or partially delete it.

Once defined in the schema, a mention in your document model looks like this:

```json
{
  "type": "mention",
  "attrs": {
    "id": "U123",
    "name": "szymon"
  }
}
```

Notice how it's not a string like `attrs.name = '@szymon'`. It's structured data with a type and attributes. This seemingly small distinction changes everything about how the editor handles it.

Because it's defined as an atomic inline node, the editor enforces special rules:

- **Arrow keys jump over it entirely** - you can't accidentally put your cursor in the middle of "@szymon" and change it to "@szmon"
- **Deletion works cleanly** - first Backspace selects the whole mention, second Backspace deletes it
- **Copy/paste preserves the data** - when you copy a mention to another message, it brings along the user ID, not just the display text
- **It can be rendered as a React component** - show an avatar, add a hover card, make it clickable, and whatever else you need

With custom inline nodes, the mention becomes a first-class citizen in the document model. The same pattern works for placeholders in translation tools (like our `{username}` example at Lokalise), inline media, tokens, badges, inline comments-anything that needs to behave as a unit while sitting inside flowing text.

## Serialization: Moving Between Formats

At some point, your editor's internal document model needs to leave the browser. Maybe you're saving to a database, sending content over an API, or letting users export their work. This is where serialization comes in-converting between the editor's format and something else.
Most editors support multiple serialization formats:

```js
editor.getJSON()
// Returns:
// {
//     type: 'doc',
//     content: [
//         {
//             type: 'paragraph',
//             content: [
//                 { type: 'text', text: 'Hello ' },
//                 { type: 'text', text: 'world', marks: [{ type: 'bold' }] }
//             ]
//         }
//     ]
// }

editor.getHTML()
// Returns: "<p>Hello <strong>world</strong></p>"
```

JSON preserves everything—custom nodes, attributes, metadata—but requires the editor to read it back. HTML is universal and easy to display, but ambiguous (is `<i>` the same as `<em>`?) and messy when pasted from external sources. Markdown (supported by some editors via extensions) is clean and human-readable, but limited in what it can express.

In practice, many applications store HTML because it's what they already have or what their API expects. It also makes the content agnostic to the editor implementation. You can switch editors or render the same content in different contexts. However, this delegates complexity to the client serialization layer, which depending on the case, may lead to worse user experience when dealing with ambiguous markup or custom node types.

The key insight is that serialization in editors is bidirectional. The editor can parse HTML back into its document model, clean it up, and normalize it against your schema. This is how editors handle pasted content from Word or Google Docs - they parse the messy HTML, extract the semantic meaning, and rebuild it as a clean document structure.

## React Integration Done Right

A rich text editor is a self-contained state machine. Trying to drive it as a controlled React component breaks everything: cursor movement, selections, performance, undo history, IME composition.

Why? React wants to own the state and re-render when it changes. But the editor's state is tightly coupled to the browser's selection API, which doesn't play nicely with React's reconciliation. When you type a character and React re-renders, it might reconstruct DOM nodes, causing the browser to lose the selection.

Instead, let the editor manage its own state. Subscribe to updates instead of mirroring state in React.

```js
onUpdate: ({ editor }) => {
  saveDraftDebounced(editor.getJSON())
}
```

React should render the editor container, not manage its inner content. Treat it like a video player or canvas element - something with its own lifecycle that exposes an imperative API.

## Why Good Editors Feel Fast

Modern editors stay fast through:

- Immutable states with structural sharing (only changed nodes are new objects)
- Minimal DOM diffs (update just the text node that changed)
- Batched updates (multiple changes render once)
- Schema enforcement (prevents degenerate cases like thousands of nested nodes)
- Avoiding unnecessary React re-renders

Most performance problems come from misuse: re-initializing the editor too often, rendering too many React components inside it, or putting it in a controlled form that re-renders on every keystroke.

Treat the editor as a stable, stateful entity and performance stays consistent even with long documents.

## Closing Thoughts

Rich text editing looks trivial until you dig in. The browser gives us powerful tools, but they're too inconsistent to build on directly. Modern editors succeed by layering structure and predictability on top of the browser's primitives.

Once you understand document models, selections, transactions, rendering, custom nodes, and serialization, the entire ecosystem clicks. Every library like Tiptap, ProseMirror, Lexical, or other is just a different expression of these same core ideas.

With this mental model, you can evaluate libraries confidently, integrate them into React without friction, and extend them in ways that stay stable over time.
