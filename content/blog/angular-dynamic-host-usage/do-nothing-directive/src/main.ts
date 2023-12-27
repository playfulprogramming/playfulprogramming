import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Directive } from "@angular/core";

@Directive({
	selector: "[doNothing]",
	standalone: true,
})
class DoNothingDirective {}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [DoNothingDirective],
	template: ` <p doNothing>I am currently unchanged.</p> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
