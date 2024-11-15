import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "app-root",
	template: `
		<ng-container>
			<ng-container>
				<ng-container>
					<p>Test</p>
				</ng-container>
			</ng-container>
		</ng-container>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
