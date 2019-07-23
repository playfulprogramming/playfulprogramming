Wel



It's worth mentioning that the syntax for this is fairly loose. You're able to move things around a bit. If it's the second argument, you can drop the `;`

```html
<p *makePiglatin="'This is a string' casing: 'UPPER'; let msg; let ogMsg = original">
```

You can drop the `:` regardless of if you use the `;`

```html
<p *makePiglatin="'This is a string' casing 'UPPER'; let msg; let ogMsg = original">
```

```html
<p *makePiglatin="'This is a string'; casing 'UPPER'; let msg; let ogMsg = original">
```

<iframe src="https://stackblitz.com/edit/start-to-source-34-syntax-looseness?ctl=1&embed=1&file=src/app/app.component.ts" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
While this might seem very strange (especially because most fully-scoped languages have very rigid syntax), there's a lot of advantages and syntactical niceness as a result of this flexibility.

#### Always Be Willing To Take Input

While the syntax is flexible, it's not unbreakable. *If you're expecting to pass an input to the directive, you must have the first thing in the syntax be the input value*. For example:

```html
<p *makePiglatin="casing 'UPPER'; 'This is a string'; let msg; let ogMsg = original">
```

Would throw an error at you as it's not valid syntax. Even if you weren't passing a value to the `makePigLatin` prop and only wanted to pass a value to the `makePigLatinCasing` prop:

```html
<p *makePiglatin="casing 'UPPER'; let msg; let ogMsg = original">
```

This wouldn't be valid syntax and would still throw an error. However, if you wanted to start a microsyntax with a local template variable definition, this IS valid:

```html
<p *makePiglatin="let msg casing 'UPPER'; let ogMsg = original">
```

This follows the same rules as before where the `;` between the `let` and `casing` and the `:` between `casing` and `'upper'` are both still validly optional.

<iframe src="https://stackblitz.com/edit/start-to-source-35-syntax-no-nos?ctl=1&embed=1&file=src/app/app.component.ts" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>