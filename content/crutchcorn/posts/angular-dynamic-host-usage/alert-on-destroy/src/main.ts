import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Directive, OnDestroy } from "@angular/core";
import { NgIf } from "@angular/common";

@Directive({
	selector: "[alertOnDestroy]",
	standalone: true,
})
class AlertOnDestroyDirective implements OnDestroy {
	ngOnDestroy() {
		alert("Element was unrendered!");
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [AlertOnDestroyDirective, NgIf],
	template: `
		<p *ngIf="render" alertOnDestroy>Unmount me to see an alert!</p>
		<button (click)="render = !render">Toggle</button>
	`,
})
class AppComponent {
	render = true;
}

bootstrapApplication(AppComponent);
