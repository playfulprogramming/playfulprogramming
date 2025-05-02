import { bootstrapApplication } from "@angular/platform-browser";

import {
	Directive,
	Component,
	inject,
	TemplateRef,
	ViewContainerRef,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

function injectAndRenderTemplate() {
	const templToRender = inject(TemplateRef);
	const parentViewRef = inject(ViewContainerRef);

	parentViewRef.createEmbeddedView(templToRender);
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
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<ng-template passBackground>
				<p>Hello, world!</p>
			</ng-template>
		</div>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
