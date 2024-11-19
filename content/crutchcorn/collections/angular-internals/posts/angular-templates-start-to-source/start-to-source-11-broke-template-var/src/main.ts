import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
	selector: "app-root",
	imports: [NgTemplateOutlet],
	template: `
		<ng-template #helloThereMsg>
			<p>Hello There!</p>
			<ng-template #testingMessage>
				<p>Testing 123</p>
			</ng-template>
		</ng-template>
		<div>
			<ng-template [ngTemplateOutlet]="helloThereMsg"></ng-template>
		</div>
		<ng-template [ngTemplateOutlet]="testingMessage"></ng-template>
	`,
})
export class AppComponent {}

bootstrapApplication(AppComponent);
