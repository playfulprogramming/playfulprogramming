import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, OnInit, Input } from "@angular/core";
import { NgIf } from "@angular/common";

@Component({
	selector: "app-alert",
	standalone: true,
	template: ` <p>Showing alert...</p> `,
})
class AlertComponent implements OnInit {
	@Input() alert!: () => void;

	ngOnInit() {
		setTimeout(() => {
			this.alert();
		}, 1000);
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [AlertComponent, NgIf],
	template: `
		<button (click)="toggle()">Toggle</button>
		<app-alert *ngIf="show" [alert]="alertUser" />
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
