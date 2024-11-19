import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, ViewChild, TemplateRef } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
	selector: "my-app",
	standalone: true,
	imports: [NgTemplateOutlet],
	template: `
		<div>
			<ng-template #helloMsg>Hello</ng-template>
		</div>
		<ng-template [ngTemplateOutlet]="helloMessageTemplate"></ng-template>
	`,
})
export class AppComponent {
	@ViewChild("helloMsg", { static: false })
	helloMessageTemplate!: TemplateRef<any>;
}

bootstrapApplication(AppComponent);
