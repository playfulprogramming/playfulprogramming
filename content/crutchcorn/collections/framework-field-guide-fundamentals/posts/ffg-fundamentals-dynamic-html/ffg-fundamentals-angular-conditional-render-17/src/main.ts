import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, input } from "@angular/core";

@Component({
	selector: "conditional-render",
	template: `<div>
		@if (bool()) {
			<p>Text here</p>
		}
	</div>`,
})
class ConditionalRenderComponent {
	bool = input.required<boolean>();
}

@Component({
	selector: "app-root",
	imports: [ConditionalRenderComponent],
	template: `
		<div>
			<h1>Shown contents</h1>
			<conditional-render [bool]="true" />
			<h1>Hidden contents</h1>
			<conditional-render [bool]="false" />
		</div>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
