import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Directive, ElementRef, inject } from "@angular/core";

const injectAndGetEl = () => {
	const el = inject(ElementRef);
	console.log(el.nativeElement);
	return el;
};

@Directive({
	selector: "[logEl]",
	standalone: true,
})
class LogElDirective {
	_el = injectAndGetEl();
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [LogElDirective],
	template: ` <p logEl>This paragraph tag will be logged!</p> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
