import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";

@Component({
	selector: "error-throwing",
	template: ` <p>Hello, world!</p> `,
})
class ErrorThrowingComponent {
	constructor() {
		throw new Error("Error");
	}
}

@Component({
	selector: "app-root",
	imports: [ErrorThrowingComponent],
	template: `<error-throwing />`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
