import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ViewContainerRef,
	OnInit,
	Input,
	TemplateRef,
	Directive,
} from "@angular/core";

@Directive({
	selector: "[renderThis]",
	standalone: true,
})
export class RenderThisDirective implements OnInit {
	constructor(
		private templ: TemplateRef<any>,
		private parentViewRef: ViewContainerRef,
	) {}

	ngOnInit(): void {
		this.parentViewRef.createEmbeddedView(this.templ);
	}
}

@Component({
	selector: "my-app",
	standalone: true,
	imports: [RenderThisDirective],
	template: `
		<ng-template renderThis>
			<p>Rendering from <code>ng-template</code></p>
		</ng-template>
	`,
})
export class AppComponent {}


bootstrapApplication(AppComponent);
