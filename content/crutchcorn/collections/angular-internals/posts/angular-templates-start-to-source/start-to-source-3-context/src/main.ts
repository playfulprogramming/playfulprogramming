import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
	selector: "my-app",
	standalone: true,
	imports: [NgTemplateOutlet],
	template: `
		<ng-template
			[ngTemplateOutlet]="showMsgToPerson"
			[ngTemplateOutletContext]="{
				$implicit: 'Hello World',
				personName: 'Corbin',
			}"
		>
		</ng-template>
		<ng-template #showMsgToPerson let-message let-thisPersonsName="personName">
			<p>{{ message }} {{ thisPersonsName }}</p>
		</ng-template>
	`,
})
export class AppComponent {}

bootstrapApplication(AppComponent);
