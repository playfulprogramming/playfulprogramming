import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Pipe, PipeTransform, signal } from "@angular/core";

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

@Component({
	selector: "app-root",
	imports: [FormatDatePipe],
	template: `
		@for (dateObj of dates(); track dateObj) {
			<p>{{ dateObj | formatDate }}</p>
		}
	`,
})
class AppComponent {
	dates = signal([
		new Date("03-15-2005"),
		new Date("07-21-2010"),
		new Date("11-02-2017"),
		new Date("06-08-2003"),
		new Date("09-27-2014"),
	]);
}

bootstrapApplication(AppComponent);
