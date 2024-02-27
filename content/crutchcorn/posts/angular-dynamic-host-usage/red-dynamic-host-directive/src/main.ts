import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Directive } from "@angular/core";

@Directive({
	selector: "[red]",
	standalone: true,
	host: {
		"[style]": `selected ? 'background-color: red; color: white;' : ''`,
		"(click)": "selected = !selected",
	},
})
class RedDirective {
	selected = false;
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RedDirective],
	template: ` <p red>This is red when I am selected</p> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
