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
		<ng-template #templ let-name="name">
			<p>{{ name }}</p>
		</ng-template>
		<ng-container
			[ngTemplateOutlet]="templ"
			[ngTemplateOutletContext]="{ name: 'Corbin' }"
		>
		</ng-container>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
