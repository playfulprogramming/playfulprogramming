---
{
title: "How Caching Data in Angular with Rxjs",
published: "2022-04-12T18:58:00Z",
edited: "2022-07-27T05:30:04Z",
tags: ["angular", "rxjs", "javascript"],
description: "When we build an app, some data like the menu and options don't change with frequency. The best...",
originalLink: "https://www.danywalls.com/how-caching-data-in-angular-with-rxjs",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

When we build an app, some data like the menu and options don't change with frequency. The best approach is to cache it because when the user moves around the app, the data to the server again impacts the speed and user experience.

Rxjs provide us with an easy way to build a cache and store it. Two operators make the magic happen, share and shareReplay, to avoid getting the data every time and avoid calculation.

## Example

I have a simple app with two routes, home and about. Home shows a list of NBA players; also, we process the data by building the fullName using his first and second names.

Every time the user moves to leave home and back, it needs to get the data and perform the process. It should be an extensive process like calculation.

Why am I getting the data again if it doesn't change with frequency? It looks like it is time for caching.

## Using shareReplay

We will improve the performance and response of our app, avoid repeating the process of building fullName for each player and have a date of the process to see the processing time.

shareReplay helps us cache data in our apps quickly and replay the data to new subscribers.

> Read more about [shareReplay](https://www.learnrxjs.io/learn-rxjs/operators/multicasting/sharereplay)

Add the shareReplay operator in the flow of data, take the data from the HTTP request, and put it into a buffer so that it can replay the last emission of my HTTP request.

```typescript
@Injectable()
export class NbaService {
  api = 'https://www.balldontlie.io/api/v1/';

  private teamUrl = this.api + 'players';
  public players$ = this.http.get<any[]>(this.teamUrl).pipe(
    map((value: any) => {
      return value?.data.map((player) => ({
        ...player,
        fullName: `${player.first_name} ${player.last_name}`,
        processed: new Date().toISOString(),
      }));
    }),
    shareReplay(1),
  );

  constructor(private http: HttpClient) {}
}
```

Perfect, we can see the data on the page. We use the Date pipe operator to better format the processed date.

```html
<ul *ngIf="players$ | async as players">
  <li *ngFor="let player of players">
    {{ player.fullName }} {{ player.processed | date: 'medium' }}
  </li>
</ul>
```

If we navigate the app from one page to another and return to the home page, it will get the data from the cache.

You can see the details in the network tab in Chrome.

[https://stackblitz.com/edit/angular-ivy-3vql5l?file=src/app/nba.service.ts](https://stackblitz.com/edit/angular-ivy-3vql5l)

Yeah, so easy, have a cache in our app! But how to force an update?

## Update the Cache and Refresh the Data

Our cache works like a charm, but sometimes the users want to force the update. How can we do that? Rxjs our life easy!

We use a behaviorSubject to help react to the action when the user wants to update the data.

First, create the behavior subject type void and new method updateData() to emit the action, create a new variable apiRequest$ to store the HTTP request.

Our players$ observable will get the value from the behavior subject and pipe the data using the operator merge map to merge the HTTP response, return the observable, and add the shareReplay.

> Read more about [merge](https://www.learnrxjs.io/learn-rxjs/operators/combination/merge).

The code will look like this:

```typescript
@Injectable()
export class NbaService {
  private _playersData$ = new BehaviorSubject<void>(undefined);
  api = 'https://www.balldontlie.io/api/v1/';

  private teamUrl = this.api + 'players';
  apiRequest$ = this.http.get<any[]>(this.teamUrl).pipe(
    map((value: any) => {
      console.log('getting data from server');
      return value?.data.map((player) => ({
        ...player,
        fullName: `${player.first_name} ${
          player.last_name
        } ${Date.now().toFixed()}`,
      }));
    })
  );

  public players$ = this._playersData$.pipe(
    mergeMap(() => this.apiRequest$),
    shareReplay(1)
  );

  constructor(private http: HttpClient) {}

  updateData() {
    this._playersData$.next();
  }
}
```

On the page, create a new button to call the service method and force updating the data trigger my behavior subject; you can play with the final version in the stackbliz example.

Perfect! You can see the final code here:
<https://stackblitz.com/edit/angular-ivy-hbf6dc?file=src%2Fapp%2Fpages%2Fhome%2Fhome.component.css>

## Recap

We create a cache and force update it easily using Rxjs, so it is easy next time you want to improve the speed and response!

I highly recommend watching a few videos of @deborahk. She explains very well everything about Rxjs and how to work with data.

- [Data Composition with RxJS | Deborah Kurata](https://www.youtube.com/watch?v=Z76QlSpYcck)
- [Collect, Combine, and Cache RxJS Streams for User-Friendly Results by Deborah Kurata](https://www.youtube.com/watch?v=HE-xh_RBIno)

Photo by <a href="https://unsplash.com/@juliazolotova?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Julia Zolotova</a> on <a href="https://unsplash.com/s/photos/fruits?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
