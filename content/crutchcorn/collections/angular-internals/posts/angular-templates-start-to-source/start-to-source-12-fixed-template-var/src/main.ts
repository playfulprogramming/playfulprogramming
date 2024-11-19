import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
	selector: "my-app",
	standalone: true,
	imports: [NgTemplateOutlet],
	template: `
		<ng-template #helloThereMsg>
			Hello There!
			<ng-template #testingMessage><p>Testing 123</p></ng-template>
			<ng-template [ngTemplateOutlet]="testingMessage"></ng-template>
		</ng-template>
		<ng-template [ngTemplateOutlet]="helloThereMsg"></ng-template>
	`,
})
export class AppComponent {}

bootstrapApplication(AppComponent);
