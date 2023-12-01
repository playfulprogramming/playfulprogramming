import "zone.js/dist/zone";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";

@Component({
	selector: "event-bubbler",
	standalone: true,
	template: `
		<div (click)="logMessage()">
			<p>
				<span style="color: red">Click me</span> or even
				<span style="background: green; color: white;">me</span>!
			</p>
		</div>
	`,
})
export class EventBubblerComponent {
	logMessage() {
		alert("Clicked!");
	}
}

bootstrapApplication(EventBubblerComponent);
