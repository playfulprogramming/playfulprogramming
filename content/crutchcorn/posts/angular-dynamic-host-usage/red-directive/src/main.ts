import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Directive, ElementRef, inject } from "@angular/core";

const injectAndMakeRed = () => {
	const el = inject(ElementRef);
	el.nativeElement.style.backgroundColor = "red";
	el.nativeElement.style.color = "white";
};

@Directive({
	selector: "[red]",
	standalone: true,
})
class RedDirective {
	_el = injectAndMakeRed();
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RedDirective],
	template: ` <p red>This is red</p> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
