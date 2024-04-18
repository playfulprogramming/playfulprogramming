A rehype plugin for rendering tabbed content from HTML comments and headings.


![preview](https://user-images.githubusercontent.com/9100169/148681602-03f6f446-7dea-4efb-ad82-132f6a8debdd.gif)

This is particularly useful when paired with a `remark` parsing step.

## Usage

### HTML Example

```html
<!-- ::start:tabs -->

<h1><b>English</b></h1>

Hello!

<h1>French</h1>

Bonjour!

<h1><i>Italian</i></h1>

Ciao!

<!-- ::end:tabs -->
```


### Markdown Example

```markdown
<!-- ::start:tabs -->

#### **English**

Hello!

#### French

Bonjour!

#### _Italian_

Ciao!

<!-- ::end:tabs -->
```

### Output

The output of this rehype plugin matches the expected output of [`react-tabs`'s HTML structure](https://github.com/reactjs/react-tabs).

This means that the above examples would render to:

```html
<tabs>
  <tab-list>
    <tab>English</tab>
    <tab>French</tab>
    <tab>Italian</tab>
  </tab-list>
  <tab-panel><p>Hello!</p></tab-panel>
  <tab-panel><p>Bonjour!</p></tab-panel>
  <tab-panel>
    <p>Bonjour!</p>
  </tab-panel>
</tabs>
```

You can then use this output with [`rehype-react`](https://github.com/rehypejs/rehype-react) to render out the expected React tabs.

## Sub-Headings

If you have sub-headings, they will not be turned into tabs. This works by detecting what the largest tab is in a `<!-- tabs` segment.

So, if you have the following:

```markdown
<!-- ::start:tabs -->

## One

Hello!

### Two

Howdy!

## Three

Hi there!

<!-- ::end:tabs -->
```

It would render "One" and "Three" as tab headings, but "Two" would be listed as a heading in the "One" tab's contents.

## Special Thanks

This syntax is inspired by: https://jhildenbiddle.github.io/docsify-tabs/#/
