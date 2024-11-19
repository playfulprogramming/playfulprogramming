import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, TemplateRef, ViewChild } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
	selector: "my-app",
	standalone: true,
	imports: [NgTemplateOutlet],
	template: `
		<div>
			<p>Hello?</p>
			<ng-template #helloThereMsg> Hello There! </ng-template>
		</div>
		<ng-template [ngTemplateOutlet]="realMsgVar"></ng-template>
	`,
})
export class AppComponent {
	@ViewChild("helloThereMsg", { static: true }) realMsgVar!: TemplateRef<any>;
}

bootstrapApplication(AppComponent);
