import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Directive } from "@angular/core";

@Directive({
	selector: "[sayHi]",
})
class LogElementDirective {
	constructor() {
		console.log("Hello, world!");
	}
}

@Component({
	selector: "app-root",
	imports: [LogElementDirective],
	template: ` <p sayHi>Hello, world</p> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
