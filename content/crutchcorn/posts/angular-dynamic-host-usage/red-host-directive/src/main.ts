import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Directive } from "@angular/core";

@Directive({
	selector: "[red]",
	standalone: true,
	host: {
		style: "background-color: red; color: white;",
	},
})
class RedDirective {}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RedDirective],
	template: ` <p red>This is red</p> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
