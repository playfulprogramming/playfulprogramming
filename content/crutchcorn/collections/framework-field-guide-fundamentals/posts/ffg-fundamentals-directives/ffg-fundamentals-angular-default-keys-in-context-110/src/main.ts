import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
	selector: "app-root",
	imports: [NgTemplateOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-template #templ let-name>{{ name }}</ng-template>
		<div
			[ngTemplateOutlet]="templ"
			[ngTemplateOutletContext]="{ $implicit: 'Corbin' }"
		></div>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
