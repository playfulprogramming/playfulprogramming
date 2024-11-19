import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ViewContainerRef,
	OnInit,
	ContentChild,
	TemplateRef,
	Directive,
} from "@angular/core";

@Directive({
	selector: "[renderTheTemplate]",
	standalone: true,
})
export class RenderTheTemplateDirective implements OnInit {
	@ContentChild(TemplateRef, { static: true }) templ!: TemplateRef<any>;
	constructor(private parentViewRef: ViewContainerRef) {}

	ngOnInit(): void {
		this.parentViewRef.createEmbeddedView(this.templ);
	}
}

@Component({
	selector: "my-app",
	standalone: true,
	imports: [RenderTheTemplateDirective],
	template: `
		<div renderTheTemplate>
			<ng-template>
				<p>Hello</p>
			</ng-template>
		</div>
	`,
})
export class AppComponent {}

bootstrapApplication(AppComponent);
