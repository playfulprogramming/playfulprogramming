import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, ElementRef, Directive } from "@angular/core";

@Directive({
	selector: "[sayHi]",
	standalone: true,
})
class LogElementDirective {
	constructor() {
		console.log("Hello, world!");
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [LogElementDirective],
	template: ` <p sayHi>Hello, world</p> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
