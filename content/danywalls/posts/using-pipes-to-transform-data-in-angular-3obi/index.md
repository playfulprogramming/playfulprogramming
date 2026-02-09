---
{
title: "Using Pipes to Transform Data in Angular",
published: "2022-04-08T16:49:00Z",
edited: "2022-07-27T05:30:36Z",
tags: ["angular", "javascript", "programming"],
description: "Angular help us to convert values for display using Pipes; the pipes are a way to transform input...",
originalLink: "https://www.danywalls.com/using-pipes-to-transform-data-in-angular",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Angular help us to convert values for display using Pipes; the pipes are a way to transform input data to a desired or wished output.

A bad practice is to use a method in the template to convert data because it hits the performance; when you need to transform some data for visualization using a Pipe.

The pipes work in our components templates using the pipe | operator getting data from the left to the pipe function on the right and returning the transform to show in the template.

Angular has a list of pipes [available](https://angular.io/api/common#pipes) for us, and we can also create a custom pipe to return ours expect data.

> You can see the final [example in stackbliz](https://angular-ivy-opaevp.stackblitz.io)

## Using currency Pipe.

For example, we have a list of job positions with salaries.

```typescript
salaryRanges = [
    {
      title: 'developer',
      salary: 90000,
    },
    {
      title: 'nbaPlayer',
      salary: 139883,
    },
    {
      title: 'doctor',
      salary: 72000,
    },
  ];
```

```html
<ul>
  <li *ngFor="let profesional of salaryRanges">
    {{ profesional.title }}
    {{ profesional.salary }}
  </li>
</ul>
```

We want to show the currency symbol, for example, $, and decimals, using the pipe currency. Angular, by default, uses USD format.

```html
<ul>
  <li *ngFor="let profesional of salaryRanges">
    {{ profesional.title }}
    {{ profesional.salary | currency }}
  </li>
</ul>
```

The output looks like

```html
developer $90,000.00
nbaPlayer $139,883.00
doctor $72,000.00
```

Very nice! What happens if we want to convert those amounts to dollars or euros. For example, to another like dollar or euros? Angular doesn't have any to do?

Let's build a custom pipe!

## Create a Custom Pipe

The Pipe is a single class implementing the PipeTransform interface.

Our pipe convertExchange gets the value and return division of the salary by 55.

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertExchange'
})
export class ConvertToExchange implements PipeTransform {
  transform(value: any, args?: any): any {
    return value / 55
  }
}

```

> Keep in mind register the Pipe in your module.

We can use nested pipes, for example, currency and convertExchange, so our Pipe performs the calculation, and the currency shows the format.

```html {{ professional.salary | convertToExchange | currency }}
```

Done the money shows with the format and the conversion rate.

```html
developer $1,636.36
nbaPlayer $2,543.33
doctor $1,309.09
```

Our Pipe is powerful because it performs actions with the data, but what happens if I want to make a little flexible for the future change the currency like USD or EURO.

First, create an object with currency with values.

```typescript
const currencyValues = {
  USD: 55,
  EURO: 75,
};
```

Next, add a new parameter in the transform method to get the currency name and create a method to return the value related to the currency.

The code will look like this:

```typescript
import { Pipe, PipeTransform } from '@angular/core';
const currencyValues = {
  USD: 55,
  EURO: 75,
};

@Pipe({
  name: 'convertToExchange'
})
export class ConvertToExchange implements PipeTransform {
  transform(value: any, currency: string): any {
    return value / this.getCurrencyValue(currency);
  }

  getCurrencyValue(currency) {
    return currencyValues[currency] | 1;
  }
}
```

Perfect! So, we use the Pipe with the parameter in the component template to pass the parameter use `:` and the value, in our case, USD or EURO.

Our convertToExchange perform calculations related to USD and the currency format, the output from convertToExchange.

```html
  {{ profesional.salary | convertToExchange: 'USD' | currency }}
```

The final output looks like:

```html
developer $1,636.36
nbaPlayer $2,543.33
doctor $1,309.09
```

## Make It Dynamic

We create a select with the list of currencies and the use can pick the conversion.

```html
<select (change)="changeTo($any($event.target).value)">
  <option value="USD">USD</option>
  <option value="EURO">EURO</option>
  <option selected>DOP</option>
</select>
```

In our component, create a new property currentCurrency with default value DOP, the property we update when we change the selection.

```typescript
 currentCurrency = 'DOP';
changeTo(currency) {
    this.currentCurrency = currency;
  }
```

Next, use the currentCurrency in the template as a parameter for the Pipe.

```html
<li *ngFor="let profesional of salaryRanges">
    {{ profesional.title }}
    {{ profesional.salary | convertToExchange: currentCurrency | currency }}
  </li>
```

Perfect, if you select a currency in the dropdown, the calculation performs again!

![Final version](./0mslvxcprr8lkmtk36e2.png)

## Conclusion

In short, Pipes are so powerful that you can read more about them in the official Angular documentation with more examples and use cases.

> Learn more about Pipes: https://angular.io/guide/pipes

You can play with the final version demo.
<https://stackblitz.com/edit/angular-ivy-opaevp?file=src%2Fapp%2Fapp.component.html>

Photo by <a href="https://unsplash.com/@realaxer?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">T K</a> on <a href="https://unsplash.com/s/photos/pipes?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
