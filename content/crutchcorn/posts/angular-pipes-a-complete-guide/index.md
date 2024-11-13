---
{
  title: "Angular Pipes: A Complete Guide",
  description: "",
  published: "2024-12-11T12:05:00.000Z",
  authors: ["crutchcorn"],
  tags: ["angular", "webdev"]
}
---

To solve the derived value problem without recomputing the values manually, Angular introduces the concept of a "pipe" into the mix of things. The idea is that a pipe runs over an input (or series of inputs), just like React's `useMemo`.

```angular-ts
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "formatDate", standalone: true })
class FormatDatePipe implements PipeTransform {
	transform(value: Date): string {
		return formatDate(value);
	}
}

@Pipe({ name: "formatReadableDate", standalone: true })
class FormatReadableDatePipe implements PipeTransform {
	transform(value: Date): string {
		return formatReadableDate(value);
	}
}
```

You may then use these pipes in your components directly inside the template.

```angular-ts
@Component({
	selector: "file-date",
	standalone: true,
	imports: [FormatReadableDatePipe, FormatDatePipe],
	template: `
		<span [attr.aria-label]="inputDate | formatReadableDate">
			{{ inputDate | formatDate }}
		</span>
	`,
})
class FileDateComponent {
	@Input() inputDate!: Date;
}
```

<!-- ::start:no-ebook -->
<iframe data-frame-title="Angular Computed Values - StackBlitz" src="pfp-code:./ffg-fundamentals-angular-computed-values-47?template=node&embed=1&file=src%2Fmain.ts"></iframe>
<!-- ::end:no-ebook -->

### Multiple Input Pipes {#multi-input-pipes}

You may notice the similarities between pipes and functions. After all, pipes are effectively functions you're able to call in your template. Much like functions, they're not limited to a single input property, either.

Let's add a second input to see if the `formatDate` pipe should return a readable date or not.

```angular-ts
@Pipe({ name: "formatDate", standalone: true })
class FormatDatePipe implements PipeTransform {
	// `dateFormat` is an optional argument. If left empty, will simply `formatDate`
	transform(value: Date, dateFormat?: string): string {
		// Stands for "Long format month, day of month, year"
		if (dateFormat === "MMMM d, Y") return formatReadableDate(value);
		return formatDate(value);
	}
}
```

Then, we can use it in our template while passing a second argument:

```angular-ts
@Component({
	selector: "file-date",
	standalone: true,
	imports: [FormatDatePipe],
	template: `
		<span [attr.aria-label]="inputDate | formatDate: 'MMMM d, Y'">
			{{ inputDate | formatDate }}
		</span>
	`,
})
class FileDateComponent {
	@Input() inputDate: Date;
}
```

<!-- ::start:no-ebook -->
<iframe data-frame-title="Angular Multi Input Pipes - StackBlitz" src="pfp-code:./ffg-fundamentals-angular-multi-input-pipes-47?template=node&embed=1&file=src%2Fmain.ts"></iframe>
<!-- ::end:no-ebook -->

### Built-In Pipes {#built-in-pipes}

Luckily, Angular's all-in-one methodology means that there's a slew of pipes that the Angular team has written for us. One such pipe is actually a date formatting pipe. We can remove our own implementation in favor of one built right into Angular!

To use the built-in pipes, we need to import them from `CommonModule` into the component. In this case, the pipe we're looking to use is called [`DatePipe`](https://angular.dev/api/common/DatePipe). This provided date pipe is, expectedly, called `date` when used in the template and can be used like so:

```angular-ts
import { DatePipe } from "@angular/common";

@Component({
	selector: "file-date",
	standalone: true,
	imports: [DatePipe],
	template: `
		<span [attr.aria-label]="inputDate | date: 'MMMM d, Y'">
			{{ inputDate | date }}
		</span>
	`,
})
class FileDateComponent {
	@Input() inputDate!: Date;
}
```

<!-- ::start:no-ebook -->
<iframe data-frame-title="Angular Built-In Pipes - StackBlitz" src="pfp-code:./ffg-fundamentals-angular-built-in-pipes-47?template=node&embed=1&file=src%2Fmain.ts"></iframe>
<!-- ::end:no-ebook -->

# Non-Prop Derived Values {#non-derived-vals}

While we've primarily used component inputs to demonstrate derived values today, both of the methods we've used thus far work for the internal component state and inputs.

<!-- ::in-content-ad title="Consider supporting" body="Donating any amount will help towards further development of the Framework Field Guide." button-text="Sponsor my work" button-href="https://github.com/sponsors/crutchcorn/" -->

Let's say that we have a piece of state called `number` in our component and want to display the doubled value of this property without passing this state to a new component:

```angular-ts
@Pipe({ name: "doubleNum", standalone: true })
class DoubleNumPipe implements PipeTransform {
	transform(value: number): number {
		return value * 2;
	}
}

@Component({
	selector: "count-and-double",
	standalone: true,
	imports: [DoubleNumPipe],
	template: `
		<div>
			<p>{{ number }}</p>
			<p>{{ number | doubleNum }}</p>
			<button (click)="addOne()">Add one</button>
		</div>
	`,
})
class CountAndDoubleComponent {
	number = 0;

	addOne() {
		this.number++;
	}
}
```

<!-- ::start:no-ebook -->
<iframe data-frame-title="Angular Non-Prop Derived - StackBlitz" src="pfp-code:./ffg-fundamentals-angular-non-prop-derived-48?template=node&embed=1&file=src%2Fmain.ts"></iframe>
<!-- ::end:no-ebook -->
