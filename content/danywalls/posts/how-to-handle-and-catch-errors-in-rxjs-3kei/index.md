---
{
title: "How to handle and catch errors in Rxjs",
published: "2022-03-11T17:18:00Z",
edited: "2022-07-27T05:31:32Z",
tags: ["javascript", "rxjs", "angular", "webdev"],
description: "In Rxjs, when we work with observables handling the errors is a bit confusing for beginners because...",
originalLink: "https://www.danywalls.com/how-to-handle-and-catch-errors-in-rxjs",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

In Rxjs, when we work with observables handling the errors is a bit confusing for beginners because you can think of a try-catch, but Rxjs came with operators to manage it, so what I can use and when?

Let's move to each step with code, the example is using angular httpClient, but it applies to any data stream.

## The scenario

Our app uses a service to get the list of beers and show the first one as the title.

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class BeerService {
  private apiUrl = 'https://api.punkapi.com/v2/beers';
  constructor(private http: HttpClient) {}

  getBeers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
```

The app component subscribes to it, shows the beers list, and takes the first one.

```typescript
import { Component, OnInit } from '@angular/core';
import { BeerService } from './beer.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'my first beer';
  beers = [];
  constructor(private beerService: BeerService) {}

  ngOnInit() {
    try {
      this.beerService.getBeers().subscribe((beers) => {
        console.log(beers);
        this.beers = beers;
        this.title = beers[0].name;
      });
    } catch (err) {
      this.title = 'Ups a error';
    }
  }
}

```

What happens if the API fails? , We change the URL to a failed URL, to catch the error with some strategies.

## Using try-cath

In javascript, we use a [try-catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) to validate a piece of code, and if something came with an error it cath.

But the try-cath is useless with our rxjs code because the errors happen in the subscribe scope, so try-catch doesn't solve anything, so we need to use Rxjs operators.

```typescript
export class AppComponent implements OnInit {
  title = 'my first beer';
  beers = [];
  constructor(private beerService: BeerService) {}

  ngOnInit() {
    try {
      this.beerService.getBeers().subscribe((beers) => {
        console.log(beers);
        this.beers = beers;
        this.title = beers[0].name;
      });
    } catch (err) {
      this.title = 'Us a error';
    }
  }
}
```

> Read more about [try-cath](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)

## So who to catch the error in the subscription?

To understand why is not working, first, remember when we subscribe to an observable, the subscribe call takes three optional arguments.

```typescript
      this.beerService
      .getBeers()
      .subscribe({
        next: (beers) => {
          console.log(beers);
          this.beers = beers;
          this.title = beers[0].name;
        },
        error: (e) => {
          console.log(e);
          this.title = 'ups';
        },
        complete: () => console.log('done'),
      });
```

- `next` or success function is called each time the stream emits a value.
- `error`: is a function called when an error occurs and gets the error.
- `complete`: is a function that gets called only if the stream completes

So the error is in the subscribe function scope, so how we can manage the case?

## Using Rxjs Operators

Rxjs provide some operators to help us with the errors, each of them is used in the scenario, let's use each of them.

We going to play with cathError,throwError and EMPTY.

### cathError

It catches the error but emits the value. In short, it takes the error and returns another observable.

I removed the previous strategy about three callback functions and used the pipe to work with the `catchError` operator.

When the API fails, I return an array with the default beer Observable object.

> Learn more about [pipe](https://rxjs.dev/guide/operators#piping)

```typescript
this.beerService
      .getBeers()
      .pipe(catchError(() => of([{ name: 'my default beer' }])))
      .subscribe((beers) => {
        console.log(beers);
        this.beers = beers;
        this.title = beers[0].name;
      });
```

The `catchError` is perfect for emitting a default value if something happens in our code, and the subscribe can take the default value as an emission.

### throwError

Sometimes we don't want to emit the error but want to notify the error; for those scenarios, the throwError helps us.

throwError does not emit the data to the next, it uses the error on the subscriber callbacks. If we want to catch a custom error or notify the backend, we can use the error callback in the subscriber.

```typescript
 ngOnInit() {
    this.beerService
      .getBeers()
      .pipe(
        catchError(() => {
          return throwError(() => new Error('ups sommething happend'));
        })
      )
      .subscribe({
        next: (beers) => {
          console.log(beers);
          this.beers = beers;
          this.title = beers[0].name;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
```

> Read more about [throwError](https://rxjs.dev/api/index/function/throwError)

### EMPTY

Sometimes we don't want to propagate the error in our component.  Rxjs provide EMPTY constant and returns an empty Observable, without emit any data to the subscriber callbacks.

```typescript
this.beerService
      .getBeers()
      .pipe(
        catchError(() => {
          return EMPTY;
        })
      )
      .subscribe({
        next: (beers) => {
          this.beers = beers;
          this.title = beers[0].name;
        },
        error: (err) => console.log(err),
      });

```

> Read more about [EMPTY](https://rxjs.dev/api/index/const/EMPTY)

## Conclusion

In short, we learn how to pipe the data and catch the errors using  `catchError`, to modify the return observable or use `EMPTY` to not trigger the error to the component.

Feel free to play with the code in \[stackbliz]\(https://stackblitz.com/edit/angular-ivy-rq2rzy?
file=src%2Fapp%2Fapp.component.ts)

Photo by John Torcasio on Unsplash
