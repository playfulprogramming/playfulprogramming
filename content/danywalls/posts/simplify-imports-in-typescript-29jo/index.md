---
{
title: "How to simplify and organize imports in Typescript",
published: "2021-10-16T13:53:19Z",
edited: "2021-10-18T07:15:50Z",
tags: ["typescript", "javascript", "webdev"],
description: "Sometimes we have a long  list of imports, with files that come from the same place, it makes our...",
originalLink: "https://dev.to/this-is-learning/simplify-imports-in-typescript-29jo",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

 

Sometimes we have a long  list of imports, with files that come from the same place, it makes our code noisy and a bit longer, something like: 

```
import { BeersService } from './services/beers.service';
import { WhiskyService } from './services/whiski.service';
import { WineService } from './services/wine.service';
```

We can simplify it by exposing all files, from a single file, to point to all of them.

Create drinks.ts into the service directory and export all services.

```typescript
export * from './beers.service';
export * from './whiski.service';
export * from './wine.service';
```
Now we can update our files, to the new path.

```typescript 
import { BeersService, WhiskyService, WineService } from './services/drinks';
```

> Thanks @lissetteibnz , If rename the filename from drinks.ts to index.ts, Javascript understand the file index like the entrypoint for the directory, so  it works only using the directory name.

```typescript
import { BeersService, WhiskyService, WineService } from './services';
```

The code looks clean and easy to ready because all of them comes from the same place.

Photo by <a href="https://unsplash.com/@marcinjozwiak?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Marcin Jozwiak</a> on <a href="https://unsplash.com/s/photos/imports?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  
