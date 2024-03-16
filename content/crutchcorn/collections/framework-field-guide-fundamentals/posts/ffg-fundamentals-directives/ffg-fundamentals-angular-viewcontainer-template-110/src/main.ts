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
	const templToRender = inject(TemplateRef<any>);
	const parentViewRef = inject(ViewContainerRef);

	parentViewRef.createEmbeddedView(templToRender);
	return templToRender;
}

@Directive({
	selector: "[passBackground]",
	standalone: true,
})
class PassBackgroundDirective {
	template = injectAndRenderTemplate();
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [PassBackgroundDirective],
	template: `
		<div>
			<ng-template passBackground>
				<p>Hello, world!</p>
			</ng-template>
		</div>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
