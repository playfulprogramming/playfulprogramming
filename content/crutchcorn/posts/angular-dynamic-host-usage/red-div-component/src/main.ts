import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";

@Component({
	selector: "red-div",
	standalone: true,
	host: {
		"[style]": `selected ? 'background-color: red; color: white;' : ''`,
		"(click)": "selected = !selected",
	},
	template: ` <span><ng-content /></span> `,
})
class RedDirective {
	selected = false;
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RedDirective],
	template: ` <red-div>This is red when I am selected</red-div> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
