import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, OnDestroy } from "@angular/core";
import { NgIf } from "@angular/common";

@Component({
	selector: "cleanup-comp",
	standalone: true,
	template: ` <p>Unmount me to see an alert</p> `,
})
class CleanupComponent implements OnDestroy {
	ngOnDestroy() {
		alert("I am cleaning up");
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [NgIf, CleanupComponent],
	template: `
		<div>
			<button (click)="toggle()">Toggle</button>
			<cleanup-comp *ngIf="show" />
		</div>
	`,
})
class AppComponent {
	show = true;

	toggle() {
		this.show = !this.show;
	}
}

bootstrapApplication(AppComponent);
