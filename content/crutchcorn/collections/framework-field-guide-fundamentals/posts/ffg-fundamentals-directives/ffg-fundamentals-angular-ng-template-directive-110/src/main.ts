import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Directive, Component } from "@angular/core";

@Directive({
	selector: "[beOnTemplate]",
	standalone: true,
})
class TemplateDirective {
	constructor() {
		alert("I am alive!");
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [TemplateDirective],
	template: ` <ng-template beOnTemplate><p>Hello, world</p></ng-template> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
