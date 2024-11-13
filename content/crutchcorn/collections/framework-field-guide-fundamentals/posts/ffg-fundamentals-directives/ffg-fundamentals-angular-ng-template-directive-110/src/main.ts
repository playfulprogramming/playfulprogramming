import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Directive, Component } from "@angular/core";

@Directive({
	selector: "[beOnTemplate]",
})
class TemplateDirective {
	constructor() {
		alert("I am alive!");
	}
}

@Component({
	selector: "app-root",
	imports: [TemplateDirective],
	template: ` <ng-template beOnTemplate><p>Hello, world</p></ng-template> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
