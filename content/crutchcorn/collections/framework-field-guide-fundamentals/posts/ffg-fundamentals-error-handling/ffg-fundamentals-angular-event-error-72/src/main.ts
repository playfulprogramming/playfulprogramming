import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";

@Component({
	selector: "error-throwing",
	standalone: true,
	template: ` <button (click)="onClick()">Click me</button> `,
})
class ErrorThrowingComponent {
	onClick() {
		throw new Error("Error");
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ErrorThrowingComponent],
	template: `<error-throwing />`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
