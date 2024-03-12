import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";

@Component({
	selector: "app-root",
	standalone: true,
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

bootstrapApplication(AppComponent);
