import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Input } from "@angular/core";
import { NgIf } from "@angular/common";

@Component({
	selector: "conditional-render",
	standalone: true,
	imports: [NgIf],
	template: `<div><p *ngIf="bool">Text here</p></div>`,
})
class ConditionalRenderComponent {
	@Input() bool!: boolean;
}

@Component({
	selector: "app-root",
	standalone: true,
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
