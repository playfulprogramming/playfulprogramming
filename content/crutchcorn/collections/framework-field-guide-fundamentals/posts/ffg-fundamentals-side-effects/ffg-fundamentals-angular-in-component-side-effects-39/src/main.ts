import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";

@Component({
	selector: "app-root",
	standalone: true,
	template: `
		<div>
			<button (click)="title = setTitles('Movies')">Movies</button>
			<button (click)="title = setTitles('Music')">Music</button>
			<button (click)="title = setTitles('Documents')">Documents</button>
			<p>{{ title }}</p>
		</div>
	`,
})
class AppComponent {
	setTitles(val: string) {
		document.title = val;

		// Adding an alert so that it's easier to see when the effect runs
		alert(`The title is now ${val}`);

		return val;
	}

	title = this.setTitles("Movies");
}

bootstrapApplication(AppComponent);
