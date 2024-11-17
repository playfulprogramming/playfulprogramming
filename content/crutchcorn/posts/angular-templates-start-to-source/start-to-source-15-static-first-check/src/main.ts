import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, TemplateRef, ViewChild } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
	selector: "my-app",
	standalone: true,
	imports: [NgTemplateOutlet],
	template: `
		<ng-template #helloThereMsg>
			Hello There!
			<ng-template #testingMessage>Testing 123</ng-template>
		</ng-template>
		<ng-template [ngTemplateOutlet]="helloThereMsg"></ng-template>
		<ng-template [ngTemplateOutlet]="testingMessageCompVar"></ng-template>
	`,
})
export class AppComponent {
	@ViewChild("testingMessage", { static: true })
	testingMessageCompVar!: TemplateRef<any>;
}

bootstrapApplication(AppComponent);
