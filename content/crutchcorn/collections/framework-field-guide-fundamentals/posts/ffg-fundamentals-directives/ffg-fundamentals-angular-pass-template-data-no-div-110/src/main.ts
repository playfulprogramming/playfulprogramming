import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [NgTemplateOutlet],
	template: `
		<ng-template #templ let-name="name">
			<p>{{ name }}</p>
		</ng-template>
		<ng-container
			[ngTemplateOutlet]="templ"
			[ngTemplateOutletContext]="{ name: 'Corbin' }"
		>
		</ng-container>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
