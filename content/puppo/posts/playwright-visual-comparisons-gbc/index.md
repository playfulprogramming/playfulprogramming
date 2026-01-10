---
{
title: "Playwright - Visual Comparisons",
published: "2023-02-02T07:51:48Z",
edited: "2023-02-21T07:22:06Z",
tags: ["playwright", "e2e", "visual"],
description: "Hi there,  Today I want to speak about Visual comparisons with Playwright.  In some projects is...",
originalLink: "https://blog.delpuppo.net/playwright-visual-comparisons",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "20832",
order: 1
}
---

Hi there,

Today I want to speak about **Visual comparisons** with Playwright.

In some projects is crucial to respect the same size for the component on the page, or to guarantee the exact visualization each time, or to ensure the same colour, etc.

Playwright exposes this feature out of the box. To do that, Playwright uses snapshots and compares a specific snapshot with the test result to check that nothing has changed.

But don't waste time, and let's see how it works.

I want to use the Square component for this example, but you have to refactor it before moving to the test. First, you have to move the X and O png images from the public folder to the Square component folder. After that, you have to refactor the component so that it imports these images and uses them to render the icon.The result is something like this:

*Folder Structure*

```sh
 Square
    O.png
    Square.module.scss
    Square.tsx
    X.png
```

*Square Component*

```ts
import { TicTacToeValue } from '../../models/TicTacToeValue';
import { Nullable } from '../../utils/Nullable';
import Icon from '../Icon/Icon';
import OIcon from './O.png';
import styles from './Square.module.scss';
import XIcon from './X.png';

interface SquareProps {
  value: Nullable<TicTacToeValue>;
  onSelect: () => void
}

export default function Square(
  { value, onSelect }: SquareProps
) {

  const icon = value === 'X' ? XIcon : OIcon;

  return (
    <button
      type='button'
      className={styles.Square}
      onClick={onSelect}>
      {value && <Icon src={icon} title={value} />}
    </button>
  )
}
```

Perfect, now you are ready to create your first test to check the visual comparisons.

Before moving on to code, you should meet what you have to know to make visual comparisons with Playwright, and the only thing that you have to know is the assertion `toHaveScreenshot`. This assertion is your best friend if you want to implement visual comparisons with Playwright, it has some configurations, but you will see the most commons later. Now, don't waste and get your hands dirty.

First of all, you have to create a new file called `src/components/Square/Square.spec.tsx`, that will contain your tests. As first example, you can create a new test that checks if the Square component shows the X icon if the value is `X`. To do that, you have to make a test like this

```ts
import { expect, test } from '@playwright/experimental-ct-react';
import Square from './Square';

test.describe('Square', () => {
  test('should show the X icon without regression', async ({ mount, page }) => {
    await mount(<Square value={'X'} onSelect={() => { }} />);
    await expect(page).toHaveScreenshot();
  });
})
```

As you can notice, this article shows the visual comparisons in the testing of the components, but you can use it in the e2e tests too.Ok, now it's time to see the result by running the command `npm run test-ct`.The result is not like expected, I suppose. In fact, the result shows an error like this:

```sh
Error: A snapshot doesn't exist at playwright-series/snapshots/components/Square/Square.spec.tsx-snapshots/Square-should-show-the-X-icon-without-regression-1-chromium-darwin.png, writing actual.
```

As you can imagine, Playwright tries to run your tests but doesn't find a snapshot to compare with your result, so it raises an error for each platform (Chrome, Firefox and WebKit). However, you can notice that three new files came up in your project. These files are the snapshot of your test. You can find them at the root of your project in the folder `__snapshots__` **.** From here, Playwright can run your test and check if the result is like on these snapshots. To check that, you can rerun the previous command and notice that the result will be better and your tests will be passed.

To double-check if the visual comparison works, you can change the icon sizes in the `Square.module.scss` file. For instance, from 100x100 pixels to 101x101 pixels.

```scss
.Square {
  width: 101px;
  height: 101px;
  background-color: #fff;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
```

If you rerun the command `npm run test-ct`, the result shows something like this:

```sh
3 failed
    [chromium] components/Square/Square.spec.tsx:6:3 Square should show the X icon without regression
    [firefox] components/Square/Square.spec.tsx:6:3 Square should show the X icon without regression
    [webkit] components/Square/Square.spec.tsx:6:3 Square should show the X icon without regression
```

And as you can imagine, your test suite failed because the result is not exactly like expected.

When we run with visual comparison, as you can imagine, introducing a regression is very easy, a pixel of difference and boom, the suite fails. Playwright knows this problem and permits you to be less strict in these cases. It's important to remember that by default, Playwright is strict and checks every single pixel of difference, but you can configure it with a threshold. The most commons are maxDiffPixelRatio, maxDiffPixels or threshold.Each configuration permits you to be slackers in different cases. For instance, if you choose the maxDiffPixels configuration, you can write the previous test in this way

```ts
test('should show the X icon without regression', async ({ mount, page }) => {
  await mount(<Square value={'X'} onSelect={() => { }} />);
  await expect(page).toHaveScreenshot({ maxDiffPixels: 500 });
});
```

If you run the command `npm run test-ct` , now the test suite has passed, and as you can imagine, Playwright has tested your new snapshot using the maxDiffPixels configuration. Hence, even if the size is different, the result is ok because it respects the maxDiffPixels configuration.

These kinds of configurations could be set as default if you want. For instance, you can decide that all the visual comparison tests must have the maxDiffPixels of 500. To do that, you can configure Playwright to have this configuration by default. In the Playwright configuration file, you can set the expect method with this configuration:

```ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  expect: {
    toHaveScreenshot: { maxDiffPixels: 500 },
  },
});
```

Last but not least, sometimes changing the component structure is required. In these cases, you have to change snapshots so that Playwright has the new comparison images in the future to check the results. To do that, you can run your test with the option `--update-snapshots`. This indicates to Playwright that the snapshots are old and that it has to change the previous results with the new ones.

Ok, I suppose you have a good idea of how visual comparison works on Playwright, and you can start to play with it without problems.I think that's all from Visual Comparison, I hope you enjoyed this content and if you have any questions, you are welcome!

See you soon folk

Bye bye

*You can find the source code of this article* [*here*](https://github.com/Puppo/playwright-series/tree/09-visual-comparisons)*.*

{% embed https://dev.to/puppo %}
