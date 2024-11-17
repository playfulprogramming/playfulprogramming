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
	selector: "[renderTheTemplate]",
	standalone: true,
})
export class RenderTheTemplateDirective implements OnInit {
	constructor(
		private parentViewRef: ViewContainerRef,
		private templToRender: TemplateRef<any>,
	) {}

	@Input() renderTheTemplate!: string;

	ngOnInit(): void {
		this.parentViewRef.createEmbeddedView(this.templToRender, {
			$implicit: this.renderTheTemplate,
		});
	}
}

@Component({
	selector: "my-app",
	standalone: true,
	imports: [RenderTheTemplateDirective],
	template: `
		<ng-template [renderTheTemplate]="'Hi there!'" let-message>
			<p>{{ message }}</p>
		</ng-template>
	`,
})
export class AppComponent {}

bootstrapApplication(AppComponent);
