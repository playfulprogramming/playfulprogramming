import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ViewContainerRef,
	Input,
	TemplateRef,
	Directive,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

@Directive({
	selector: "[renderThisIf]",
	standalone: true,
})
export class RenderThisIfDirective {
	constructor(
		private templ: TemplateRef<any>,
		private parentViewRef: ViewContainerRef,
	) {}

	private _val!: boolean;

	@Input() set renderThisIf(val: boolean) {
		this._val = val;
		this.update();
	}

	update(): void {
		if (this._val) {
			this.parentViewRef.createEmbeddedView(this.templ);
		}
	}
}

@Component({
	selector: "my-app",
	standalone: true,
	imports: [RenderThisIfDirective, FormsModule],
	template: `
		<label for="boolToggle">Toggle me!</label>
		<input id="boolToggle" type="checkbox" [(ngModel)]="bool" />
		<div *renderThisIf="bool">
			<p>Test</p>
		</div>
	`,
})
export class AppComponent {
	bool = false;
}

bootstrapApplication(AppComponent);
