import { bootstrapApplication } from "@angular/platform-browser";

import {
	Directive,
	Component,
	inject,
	TemplateRef,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

function injectTemplateAndLog() {
	const template = inject(TemplateRef);
	console.log(template);
	return template;
}

@Directive({
	selector: "[item]",
})
class ItemDirective {
	constructor() {
		injectTemplateAndLog();
	}
}

@Component({
	selector: "app-root",
	imports: [ItemDirective],
	template: `
		<div>
			<ng-template item>
				<p>Hello, world!</p>
			</ng-template>
		</div>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
