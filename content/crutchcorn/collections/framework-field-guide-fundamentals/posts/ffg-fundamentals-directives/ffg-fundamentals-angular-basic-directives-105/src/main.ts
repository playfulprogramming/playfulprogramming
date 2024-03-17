import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, inject, ElementRef, Directive } from "@angular/core";

function injectElAndStyle() {
	const el = inject(ElementRef<any>);
	el.nativeElement.style.background = "red";
	return el;
}

@Directive({
	selector: "[styleBackground]",
	standalone: true,
})
class StyleBackgroundDirective {
	el = injectElAndStyle();
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [StyleBackgroundDirective],
	template: ` <button styleBackground>Hello, world</button> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
