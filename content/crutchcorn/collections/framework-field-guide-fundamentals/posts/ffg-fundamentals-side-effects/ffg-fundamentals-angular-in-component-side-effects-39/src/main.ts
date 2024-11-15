import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, effect, signal } from "@angular/core";

@Component({
	selector: "app-root",
	template: `
		<div>
			<button (click)="title.set('Movies')">Movies</button>
			<button (click)="title.set('Music')">Music</button>
			<button (click)="title.set('Documents')">Documents</button>
			<p>{{ title() }}</p>
		</div>
	`,
})
class AppComponent {
	title = signal("Movies");

	constructor() {
		// effect will re-run whenever `this.title` is updated
		effect(() => {
			document.title = this.title();

			// Adding an alert so that it's easier to see when the effect runs
			alert(`The title is now ${this.title()}`);
		});
	}
}

bootstrapApplication(AppComponent);
