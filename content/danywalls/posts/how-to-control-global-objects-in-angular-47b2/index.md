---
{
title: "How to control global objects in Angular.",
published: "2021-10-05T13:31:55Z",
edited: "2021-10-27T15:15:23Z",
tags: ["angular", "codenewbie", "javascript"],
description: "When we use external libraries, it is very common to declare a global object and use it.  But the...",
originalLink: "https://dev.to/this-is-angular/how-to-control-global-objects-in-angular-47b2",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

When we use external libraries, it is very common to declare a global object and use it.  But the price to pay is get complex testing scenario, and of course `global` object like magic is not a “good practice”.

> How I can tell to angular about provide an external library declared as global?

My example was using the leaflet library, using the InjectionToken class and @Inject.

> If you want to read more about it.

— https://angular.io/api/core/InjectionToken
— https://angular.io/api/core/inject#usage-notes

## Install leaflet

Install the leaflet package and register into the angular.json to load the library.

```bash
npm install leaflet
```

Open the angular.json file and add leaflet.css and leaflet.js assets.

```json
     "styles": [
         "src/styles.css",
         "node_modules/leaflet/dist/leaflet.css"
        ],
     "scripts": [
         "node_modules/leaflet/dist/leaflet.js"             
       ]
},
          "configurations": { ...
```

## Leaflet API

To use the methods provide by leaflet, we define the contract with the global object. It's optional, but makes our code easy to follow, so create an interface with the public methods.

```typescript
export interface LeafletAPI { 
    map(id:string):object;
   setView(points: [], id:number): object;
   tileLayer(url:string, options:object): object;
   addTo(map:object):void;
}
```

## Use the InjectionToken Class

Import the InjectionToken class from `@angular/core`, it helps us create new instance, given the LeafletAPI. And find the global object using a string name. The leaflet value is “L”.

```typescript
import { InjectionToken} from '@angular/core';
export let LEAFLET_TOKEN = new InjectionToken<LeafletAPI>('L');
```

## Provide the Leaflet

In the AppModule, declare a variable for the `L`, register the `LEAFLET_TOKEN` and set the `useValue` to L, into the providers.

Now,  Angular return an instance of  `L`  when, someone when request the `LEAFLET_TOKEN` to be injected.

```typescript
import { NgModule } from  '@angular/core';
import { BrowserModule } from  '@angular/platform-browser';
import { AppComponent } from  './app.component';
import { LealefAPI, LEALEF_TOKEN } from  './services/lealef.injector';
declare  let  L:  LealefAPI;

@NgModule({
	declarations: [
	AppComponent
	],
	imports: [BrowserModule],
	providers: [
		{ provide: LEALEF_TOKEN, useValue: L}
	],
	bootstrap: [AppComponent]
})
export  class  AppModule { }
```

## Using @Inject

The @Inject() allow us to let Angular know which object must be injected, so using the token, the DI will return the value declared in the providers for our token.

In our case the key is the LEAFLET\_TOKEN, angular load it from our register provider and create a new service `MapService`, in the constructor use declare leaflet field using @Inject and the token.

```typescript
import { Inject, Injectable } from '@angular/core';
import { LeafletAPI, LEAFLET_TOKEN } from './lealef.injector';

@Injectable()
export class MapService {
    constructor(@Inject(LEAFLET_TOKEN) private _leaflet: LealefAPI) { }
```

The Leaflet was injected on the MapService by the Angular dependency injector, and we are ready to use the methods provided by LealefAPI.

```typescript
@Injectable()
export class MapService {
   constructor(@Inject(LEAFLET_TOKEN) private _leaflet: LealefAPI) { }
   
   showMenorca(): void {
        let map = this._leaflef.map('mapid').setView([39.9255, 4.032], 13);
        const tiles = this._leaflef.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                maxZoom: 8,
                minZoom: 3
            }
        );        
        tiles.addTo(map);       
    }
   }
}
```

## That's it!

Hopefully, that will give you a bit of help with how avoid global object and use InjectionToken and @Inject. If you enjoyed this post, share it!

Photo by <a href="https://unsplash.com/@cferdo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Fernando @cferdo</a> on <a href="https://unsplash.com/s/photos/global?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
