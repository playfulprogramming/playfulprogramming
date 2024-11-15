import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, effect, signal } from "@angular/core";

@Component({
	selector: "cleanup-comp",
	template: ` <p>Unmount me to see an alert</p> `,
})
class CleanupComponent {
	constructor() {
		effect((onCleanup) => {
			onCleanup(() => {
				alert("I am cleaning up");
			});
		});
	}
}

@Component({
	selector: "app-root",
	imports: [CleanupComponent],
	template: `
		<div>
			<button (click)="toggle()">Toggle</button>
			@if (show()) {
				<cleanup-comp />
			}
		</div>
	`,
})
class AppComponent {
	show = signal(true);

	toggle() {
		this.show.set(!this.show());
	}
}

bootstrapApplication(AppComponent);
