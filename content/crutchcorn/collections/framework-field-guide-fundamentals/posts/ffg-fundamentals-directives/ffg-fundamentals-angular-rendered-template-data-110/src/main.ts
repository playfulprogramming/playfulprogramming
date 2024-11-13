import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Directive,
	Component,
	inject,
	TemplateRef,
	ViewContainerRef,
} from "@angular/core";

function injectAndRenderTemplate() {
	const templToRender = inject(TemplateRef);
	const parentViewRef = inject(ViewContainerRef);

	parentViewRef.createEmbeddedView(templToRender, {
		backgroundColor: "grey",
	});
	return templToRender;
}

@Directive({
	selector: "[passBackground]",
})
class PassBackgroundDirective {
	constructor() {
		injectAndRenderTemplate();
	}
}

@Component({
	selector: "app-root",
	imports: [PassBackgroundDirective],
	template: `
		<div>
			<ng-template passBackground let-backgroundColor="backgroundColor">
				<p [style]="{ backgroundColor }">Hello, world!</p>
			</ng-template>
		</div>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
