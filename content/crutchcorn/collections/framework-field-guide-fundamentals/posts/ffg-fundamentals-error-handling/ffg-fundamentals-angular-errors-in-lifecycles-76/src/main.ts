import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, effect } from "@angular/core";

@Component({
	selector: "app-root",
	standalone: true,
	template: ` <p>Hello, world!</p> `,
})
class AppComponent {
	// Will not prevent `Hello, world!` from showing
	constructor() {
		effect(() => {
			throw new Error("Error in constructor");
		});
	}
}

bootstrapApplication(AppComponent);
