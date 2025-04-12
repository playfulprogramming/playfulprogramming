import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
	selector: "my-app",
	imports: [NgTemplateOutlet],
	template: `
		<ng-template #falseTemp>
			<p>False</p>
		</ng-template>
		<ng-template #ifTrueCondTempl>
			<p>True</p>
		</ng-template>
		<ng-template
			[ngTemplateOutlet]="bool ? ifTrueCondTempl : falseTemp"
		></ng-template>
	`,
})
export class AppComponent {
	bool = true;
}

bootstrapApplication(AppComponent);
