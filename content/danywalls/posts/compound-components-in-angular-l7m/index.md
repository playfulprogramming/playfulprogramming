---
{
title: "How to Build Compound Components in Angular",
published: "2022-09-27T12:11:39Z",
edited: "2022-09-30T10:50:47Z",
tags: ["angular", "javascript"],
description: "When we need to have different versions and use cases and make it flexible to the changes, however,...",
originalLink: "https://www.danywalls.com/compound-components-in-angular",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

When we need to have different versions and use cases and make it flexible to the changes, however, some stuff becomes a bit complex.

For example, we need to show the list of the country in one case, the company flag or the name of the selected country, in our head comes with some solutions using Angular.

**Option A** Create a single component with all the logic and use cases. With `ng-container` and *ngIf* directive. It creates a component with a vast amount of logic and interaction in a single component.

```html
<hello name="{{ name }}"></hello>
<select>
    <option>A</option>
	<option>B</option>
</select>
<ng-container *ngIf="country">
 <h1>The country</h1>
</ng-container>
<ng-container *ngIf="flag">
 <h1>The flag</h1>
</ng-container>
```

**Option B:** Create a version for each case and provide a unique experience for each scenario like:

```html
<country></country>
<country-with-message></country-with-message>
<country-with-flag></country-with-flag>
```

Alternatively, use the *Compound Component Pattern*, one component to control the state and interaction between the user and the state, and other components for rendering and reacting to changes.

## What is Compound Component?

It is a group of components or child components working together to help us to create a complex component; some frameworks like Kendo UI play with components connected with other components in their context.

For example, The Kendo Charts kendo-chart, kendo-chart-title, and kendo-chart-series work together to share data, state, and context to create a fantastic chart.

```html
<kendo-chart>
   <kendo-chart-title
​    text="Amazing title"
   \></kendo-chart-title>
   <kendo-chart-series></kendo-chart-series>
 <kendo-charts>
```

Also, it is a clear and semantic code for others when working with our components, giving them a straightforward way to work with them.

Creating the component is easy, but creating a powerful, flexible component needs checkpoints before starting.

- How does the component syntax look like?
- Will the component emit or interact with other components?
- Will the component share State?
- Will it have one or more child components?

To learn about and create compound components, we will leverage some Angular features like NgContent, ContentChild Decorator, and Component Dependency Injection.

## The List Of Countries

To have an isolated scope for our components, we provide the list of countries with CountryService to use in the component.

```typescript
import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";

interface country {
 name:string;
 code: string | null;
}

@Injectable({
 providedIn: 'root'
})
export class CountryService {
 countries: country[] = [
  {name: 'Australia', code: 'AU'},
  {name: 'Austria', code: 'AT'},
  {name: 'Azerbaijan', code: 'AZ'},
  {name: 'Bahamas', code: 'BS'},
 ]

 getCountries(): Observable<country[]> {
    return of(this.countries);
 }
}
```

## The Country Component

Let us build the country component as outer, with the HTML select to show the list of countries provided by CountryService in the constructor and use the async pipe to subscribe to the countryService.

Here is the full code:

```typescript
import {Component } from '@angular/core';
import {CountryService} from "../services/country.service";

@Component({
 selector: 'app-country',
 templateUrl: './country.component.html',
 styleUrls: ['./country.component.css']
})

export class CountryComponent  {
 countries$ = this.countryService.getCountries();
 constructor(private countryService: CountryService) {  }
}
```

Using the async pipe, we subscribe to countries$ observable and the *ngFor* to iterate over the list.

```html
<select>
  <option *ngFor="let country of countries$ | async" [value]="country.code">
​    {{ country.name }}
  </option>
</select>
```

Read more about [\*ngFor](https://angular.io/api/common/NgForOf)  and [async](https://angular.io/api/common/AsyncPipe).

## Content Projection

The country component needs to be flexible and have a simple and semantic API for other developers to use, something like:

```html
<country>
  <country-flag></country-flag>
  <country-selected></country-selected>
</country>
```

We need to use content projection to allow the country component to accept content from other components.

Content projection allows the component to get content by adding the <ng-content></ng-content> element into the country component HTML to allow of content from other components.

Adding the ng-content element, the country component can render and use the content from those nested components.

```html
<select>
 <option *ngFor="let country of countries$ | async" [value]="country.code">
  {{ country.name }}
 </option>
</select>
<ng-content>
</ng-content>
```

Read more about [Content Projection](https://angular.io/guide/content-projection).

## The Childs Components

Next, we create the components flag and message with a *@Input* selected property to use with *ngIf* to show his content.

```typescript
import { Component, Input } from '@angular/core';
@Component({
 selector: 'app-country-flag',
 templateUrl: './country-flag.component.html'
})

export class CountryFlagComponent  {
 @Input() selected!: string;
}
```

The CountryFlag renders the image using countryflagapi.com when getting the selected value.

```html
<div *ngIf="selected">
​    <img src="https://countryflagsapi.com/png/{{selected}}"/>
</div>
```

The code for CountrySelectedComponet uses the same logic.

```typescript
import { Component, Input, OnInit } from '@angular/core';

@Component({
 selector: 'app-country-selected',
 templateUrl: './country-selected.component.html'
})

export class CountrySelectedComponent {
 @Input() selected!: string;
}

<div *ngIf="selected">
 Thanks {{selected}} is a great country!
</div>
```

Done, Next we start to communicate the Country Component with our Child components.

## Using @ContentChild

In the country component context, we want to interact with our components, CountrySelectedComponent and CountryFlagComponent.

Using the @ContentChild decorator to get a reference for these components.

```typescript
@ContentChild(CountrySelectedComponent) countrySelected!: CountrySelectedComponent;
@ContentChild(CountryFlagComponent) countryFlag!: CountryFlagComponent;
```

Create selectedCountry method and the change event for selection to get the country selected.

```html
<select #country (change)="selectedCountry(country.value)">
```

The selectedCountry method updates the selected property for each component, and it reacts to changes.

```typescript
selectedCountry(select:HTMLSelectElement):void {
  this.countrySelected.selected = select.value;
  this.countryFlag.countrySelected = select.value;

 }
```

The country component is ready to react when the input changes and adds the components CountrySelectedComponent or, CountryFlagComponent into his body.

```html
<app-country>
 <app-country-selected></app-country-selected>
 <app-country-flag></app-country-flag>
</app-country>
```

> Learn more about [ContentChild](https://angular.io/api/core/ContentChild)

### Dependency Injection Component

The country component uses ContentChild for each component. However, what happens if the developer wants to use two or five times the component flag or add a banner component when selecting the country, some like:

```html
<app-country>
 <app-country-selected></app-country-selected>
 <app-country-flag></app-country-flag>
 <app-country-flag></app-country-flag>
 <app-banner></app-banner>
</app-country>
```

The official Angular documentation says:

@ContentChild Use to get the first element or the directive matching the selector from the content DOM. If the content DOM changes and a new child matches the selector, the property will be updated.

The components react to changes, and the new component app-banner needs to add a reference in the CountryComponent. It does not scale for future changes.

## Refactor

Remove ContentChild references to static components, create a subject to use as a communication bus, and use the `next` method to emit subscription value. The final code looks like this:

```typescript
export class CountryComponent  {
 countries$ = this.countryService.getCountries();
 selected$: Subject<string> = new Subject<string>();
 constructor(private countryService: CountryService) { }
 changed(value: any) {
  this.selected$.next(value);
 }
}
```

Inject into the constructor for child components to use the selected$ observable and subscribe in the template using the async pipe to store the value in the countryName variable.

The code looks like this:

```typescript
export class CountryFlagComponent  {

  constructor(public country: CountryComponent) {

  }

}
```

Use the country component state in the template:

```html
*ngIf="country.selected$ |async as countryName"
```

Perfect! All components react to changes in the country's context, and other components use the selected value from CountryComponent injecting him into the constructor.

## Recap

In this post, we have implemented the Compound Component Pattern in Angular using [dependency injection](https://angular.io/guide/dependency-injection), how to use Content Projection, and created an excellent API for our components.

Read the complete code: https://github.com/danywalls/compound-components-angular.
