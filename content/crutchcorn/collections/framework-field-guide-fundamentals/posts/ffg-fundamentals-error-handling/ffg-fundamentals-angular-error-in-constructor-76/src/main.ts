import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";

@Component({
	selector: "app-root",
	template: ` <p>Hello, world!</p> `,
})
class AppComponent {
	// This will prevent rendering
	constructor() {
		throw new Error("Error in constructor");
	}
}

bootstrapApplication(AppComponent);
