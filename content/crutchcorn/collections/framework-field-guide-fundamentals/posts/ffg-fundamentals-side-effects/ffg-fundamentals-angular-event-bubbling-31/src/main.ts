import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";

@Component({
	selector: "event-bubbler",
	template: `
		<div (click)="logMessage()">
			<p>
				<span style="color: red">Click me</span> or even
				<span style="background: green; color: white;">me</span>!
			</p>
		</div>
	`,
})
class EventBubblerComponent {
	logMessage() {
		alert("Clicked!");
	}
}

bootstrapApplication(EventBubblerComponent);
