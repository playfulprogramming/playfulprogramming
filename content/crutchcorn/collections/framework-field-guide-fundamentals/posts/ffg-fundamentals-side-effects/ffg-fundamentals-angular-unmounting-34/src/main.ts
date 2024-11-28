import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, OnDestroy } from "@angular/core";

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
	imports: [CleanupComponent],
	template: `
		<div>
			<button (click)="toggle()">Toggle</button>
			@if (show) {
				<cleanup-comp />
			}
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
