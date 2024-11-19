import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";
import { NgIf, UpperCasePipe } from "@angular/common";

@Component({
	selector: "my-app",
	imports: [NgIf, UpperCasePipe],
	template: `
		<p *ngIf="message | uppercase as uppermessage">{{ uppermessage }}</p>
		<!-- Will output "HELLO THERE, WORLD" -->
	`,
})
export class AppComponent {
	message = "Hello there, world";
}

bootstrapApplication(AppComponent);
