import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";
import { NgIf } from "@angular/common";

@Component({
	selector: "my-app",
	imports: [NgIf],
	template: `
		<ng-template #falseTemp>
			<p>False</p>
		</ng-template>
		<p *ngIf="bool; else falseTemp">True</p>
	`,
})
export class AppComponent {
	bool = false;
}

bootstrapApplication(AppComponent);
