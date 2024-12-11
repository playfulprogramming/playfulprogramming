import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, signal } from "@angular/core";
import { DatePipe } from "@angular/common";

@Component({
	selector: "app-root",
	imports: [DatePipe],
	template: `
		@for (dateObj of dates(); track dateObj) {
			<p>{{ dateObj | date: "MMMM d, Y" }}</p>
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
