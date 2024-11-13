import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
	selector: "app-root",
	imports: [NgTemplateOutlet],
	template: `
		<ng-template #templ let-name>{{ name }}</ng-template>
		<div
			[ngTemplateOutlet]="templ"
			[ngTemplateOutletContext]="{ $implicit: 'Corbin' }"
		></div>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
