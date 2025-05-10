import { bootstrapApplication } from "@angular/platform-browser";

import {
	Directive,
	Component,
	inject,
	TemplateRef,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
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
	changeDetection: ChangeDetectionStrategy.OnPush,
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
