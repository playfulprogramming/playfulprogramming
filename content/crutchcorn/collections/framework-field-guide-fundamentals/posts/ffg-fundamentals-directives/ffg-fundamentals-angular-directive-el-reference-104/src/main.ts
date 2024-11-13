import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, inject, ElementRef, Directive } from "@angular/core";

function findAndLogTheElement() {
	const el = inject(ElementRef<any>);
	// HTMLParagraphElement
	console.log(el.nativeElement);
	return el;
}

@Directive({
	selector: "[sayHi]",
})
class LogElementDirective {
	el = findAndLogTheElement();
}

@Component({
	selector: "app-root",
	imports: [LogElementDirective],
	template: ` <p sayHi>Hello, world</p> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
