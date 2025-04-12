import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { NgIf } from "@angular/common";

@Component({
	selector: "app-alert",
	standalone: true,
	template: ` <p>Showing alert...</p> `,
})
class AlertComponent implements OnInit {
	@Output() alert = new EventEmitter();

	ngOnInit() {
		// Notice that we don't clean up this side effect
		setTimeout(() => {
			this.alert.emit();
		}, 1000);
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [AlertComponent, NgIf],
	template: `
		<div>
			<!-- Try clicking and unclicking quickly -->
			<button (click)="toggle()">Toggle</button>
			<!-- Binding to an event -->
			<app-alert *ngIf="show" (alert)="alertUser()" />
		</div>
	`,
})
class AppComponent {
	show = false;

	toggle() {
		this.show = !this.show;
	}

	alertUser() {
		alert("I am an alert!");
	}
}

bootstrapApplication(AppComponent);
