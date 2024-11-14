---
{
  title: "Angular Pipes: A Complete Guide",
  description: "",
  published: "2024-12-11T12:05:00.000Z",
  authors: ["crutchcorn"],
  tags: ["angular", "webdev"],
}
---

As I explain in [my book, The Framework Field Guide, that teaches React, Angular, and Vue all at once](/posts/ffg-fundamentals-derived-values), having derived data is mission critical for any sufficiently mature and production-ready framework.

The general idea is as such:

```javascript
const count = 1;
// How to get this to regenerate when the variable above changes
const doubleCount = count * 2;
// Such that this bit of UI is always up-to-date
el.innerText = doubleCount;
```

While Angular has a great way of handling this inside of class logic via `computed`:

```angular-ts
@Component({
    selector: "app-root",
	template: `
		<p>{{doubleCount}}</p>
	`
})
class AppComponent {
	count = signal(1);
	doubleCount = computed(() => this.count() * 2);
}
```

It's often not a perfect solution when you need an in-template variable.

For example, let's say that you had a list of dates you wanted to display to your user:

```angular-ts
@Component({
    selector: "app-root",
	template: `
		@for (dateObj of dates(); track dateObj) {
			<p>{{dateObj}}</p>
		}
	`
})
class AppComponent {
	dates = signal([
        new Date("03-15-2005"),
        new Date("07-21-2010"),
        new Date("11-02-2017"),
        new Date("06-08-2003"),
        new Date("09-27-2014")
    ]);
}
```

Now, to visually display the date in a form akin to `"March 15, 2005"`, we'd need to pass each `Date` object through `Intl.DateTimeFormat` like so:

```typescript
new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
}).format(dateGoesHere);
```

We can do this using a `computed` field:

```angular-ts
@Component({
    selector: "app-root",
	template: `
		@for (dateObj of dates(); track dateObj) {
			<p>{{dateObj}}</p>
		}
	`
})
class AppComponent {
	dates = signal([
        new Date("03-15-2005"),
        new Date("07-21-2010"),
        new Date("11-02-2017"),
        new Date("06-08-2003"),
        new Date("09-27-2014")
    ]);
    
    displayableDates = computed(() => this.dates.map(date =>
    	new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
   	 	}).format(date)
    );
}
```

But this can be a bit verbose and tricky to keep track of in larger codebases.

Instead, Angular provides us a different API: Pipes.

# Introducing pipes {#intro}

To solve this problem, Angular introduced a nice way to call functions right from the template itself.

We start with the `@Pipe` definition:

```typescript
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "formatDate" })
class FormatDatePipe implements PipeTransform {
	transform(value: Date): string {
		return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
   	 	}).format(value);
	}
}
```

You may then use these pipes in your components directly inside the template.

```angular-ts
@Component({
    selector: "app-root",
	imports: [FormatDatePipe],
	template: `
		@for (dateObj of dates(); track dateObj) {
			<p>{{dateObj | formatDate}}</p>
		}
	`
})
class AppComponent {
	dates = signal([
        new Date("03-15-2005"),
        new Date("07-21-2010"),
        new Date("11-02-2017"),
        new Date("06-08-2003"),
        new Date("09-27-2014")
    ]);
}
```

<iframe data-frame-title="Intro to Pipes - StackBlitz" src="pfp-code:./intro-to-pipes-1?template=node&embed=1&file=src%2Fmain.ts"></iframe>

# Multiple Input Pipes {#multi-input-pipes}

You may notice the similarities between pipes and functions. After all, pipes are effectively functions you're able to call in your template. Much like functions, they're not limited to a single input property, either.

Let's add a second input to have `formatDate` return a specific date format.

```typescript
@Pipe({ name: "formatDate" })
class FormatDatePipe implements PipeTransform {
    // `dateFormat` is an optional argument. If left empty, will simply `DateTimeFormat`
    transform(value: Date, dateFormat?: string): string {
        // Stands for "Long format month, day of month, year"
        if (dateFormat === "MMMM d, Y") {
            return new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }).format(value);
        }
        return new Intl.DateTimeFormat("en-US").format(value);
    }
}
```

Then, we can use it in our template while passing a second argument:

```angular-ts
@Component({
    selector: "app-root",
	imports: [FormatDatePipe],
	template: `
		@for (dateObj of dates(); track dateObj) {
			<p>{{dateObj | formatDate: 'MMMM d, Y'}}</p>
		}
	`
})
class AppComponent {
	dates = signal([
        new Date("03-15-2005"),
        new Date("07-21-2010"),
        new Date("11-02-2017"),
        new Date("06-08-2003"),
        new Date("09-27-2014")
    ]);
}
```

<iframe data-frame-title="Multi Input Pipes - StackBlitz" src="pfp-code:./multi-input-pipes-2?template=node&embed=1&file=src%2Fmain.ts"></iframe>

# Built-In Pipes {#built-in-pipes}

Luckily, Angular's all-in-one methodology means that there's a slew of pipes that the Angular team has written for us. One such pipe is actually a date formatting pipe. We can remove our own implementation in favor of one built right into Angular!

To use the built-in pipes, we need to import them from `CommonModule` into the component. In this case, the pipe we're looking to use is called [`DatePipe`](https://angular.dev/api/common/DatePipe). This provided date pipe is, expectedly, called `date` when used in the template and can be used like so:

```angular-ts
import { DatePipe } from "@angular/common";

@Component({
    selector: "app-root",
	imports: [DatePipe],
	template: `
		@for (dateObj of dates(); track dateObj) {
			<p>{{dateObj | date: 'MMMM d, Y'}}</p>
		}
	`
})
class AppComponent {
	dates = signal([
        new Date("03-15-2005"),
        new Date("07-21-2010"),
        new Date("11-02-2017"),
        new Date("06-08-2003"),
        new Date("09-27-2014")
    ]);
}
```

<iframe data-frame-title="Built-In Pipes - StackBlitz" src="pfp-code:./built-in-pipes-3?template=node&embed=1&file=src%2Fmain.ts"></iframe>

## List of Built-in Pipes

Since Angular 19, the following pipes are available out of the box in `@angular/common`:

| Name                               | 	Description                                                          |
|------------------------------------|-----------------------------------------------------------------------|
| [`AsyncPipe`](https://angular.dev/api/common/AsyncPipe)           | 	Handles Promises and RxJS Observables.                               |
| [`CurrencyPipe`](https://angular.dev/api/common/CurrencyPipe)     | Handles the conversion from a `number` to a locale'd currency string. |
| [`DatePipe`](https://angular.dev/api/common/DatePipe)             | 	Handles the conversion from a `Date` to a locale'd date string.      |
| [`DecimalPipe`](https://angular.dev/api/common/DecimalPipe)       | 	Handles the conversion from a `number` to a locale'd decimal string. |
| [`I18nPluralPipe`](https://angular.dev/api/common/I18nPluralPipe) | 	Handles pluralizing a string in a locale'd manner.                   |
| [`I18nSelectPipe`](https://angular.dev/api/common/I18nSelectPipe) | 	Handle the mapping from a value to a locale                          |
| [`JsonPipe`](https://angular.dev/api/common/JsonPipe)             | 	Handles data via `JSON.stringify`.                                   |
| [`KeyValuePipe`](https://angular.dev/api/common/KeyValuePipe)     | 	Handles key value pair transform of objects.                         |
| [`LowerCasePipe`](https://angular.dev/api/common/LowerCasePipe)   | 	Handles lowercasing of a string.                                     |
| [`PercentPipe`](https://angular.dev/api/common/PercentPipe)       | 	Handles the conversion from a number to a locale'd percent string    |
| [`SlicePipe`](https://angular.dev/api/common/SlicePipe)           | 	Handles subsets of an array using `slice`                            |
| [`TitleCasePipe`](https://angular.dev/api/common/TitleCasePipe)   | 	Handles title-casing of a string.                                    |
| [`UpperCasePipe`](https://angular.dev/api/common/UpperCasePipe)   | 	Handles uppercasing of a string.                                     |

# Non-Prop Derived Values {#non-derived-vals}

While we've primarily used component inputs to demonstrate derived values today, both of the methods we've used thus far work for the internal component state and inputs.

<!-- ::in-content-ad title="Consider supporting" body="Donating any amount will help towards further development of the Framework Field Guide." button-text="Sponsor my work" button-href="https://github.com/sponsors/crutchcorn/" -->

Let's say that we have a piece of state called `number` in our component and want to display the doubled value of this property without passing this state to a new component:

```angular-ts
@Pipe({ name: "doubleNum" })
class DoubleNumPipe implements PipeTransform {
  transform(value: number): number {
    return value * 2;
  }
}

@Component({
  selector: "app-root",
  imports: [DoubleNumPipe],
  template: `
    <div>
      <p>{{ number() }}</p>
      <p>{{ number() | doubleNum }}</p>
      <button (click)="addOne()">Add one</button>
    </div>
  `,
})
class AppComponent {
  number = signal(0);

  addOne() {
    this.number.set(this.number() + 1);
  }
}
```

<iframe data-frame-title="Non-Prop Derived - StackBlitz" src="pfp-code:./non-prop-derived-4?template=node&embed=1&file=src%2Fmain.ts"></iframe>

# Performance Concerns

// TODO: Talk about `pure: true` and how it differs from existing pipes

> A pure pipe is only called when Angular detects a change in the value or the parameters passed to a pipe.
> 
> An impure pipe is called for every change detection cycle no matter whether the value or parameter(s) changes.
> https://stackoverflow.com/a/39285608

# Using Services in Pipes

// TODO: "Just like components or directives"

```angular-ts
@Injectable({ providedIn: "root" })
class UserService {
  name = "Corbin Crutchley";
}

@Pipe({ name: "greeting" })
class GreetingPipe implements PipeTransform {
  userService = inject(UserService);

  transform(greeting: string) {
    return `${greeting}, ${this.userService.name}`;
  }
}

@Component({
  selector: "app-root",
  imports: [GreetingPipe],
  template: `
    <div>
      <p>{{ "Hello" | greeting }}</p>
    </div>
  `,
})
class AppComponent {
}
```