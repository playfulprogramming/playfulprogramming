import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	signal,
	effect,
	output,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "app-alert",
	template: ` <p>Showing alert...</p> `,
})
class AlertComponent {
	alert = output();

	constructor() {
		effect(() => {
			// Notice that we don't clean up this side effect
			setTimeout(() => {
				this.alert.emit();
			}, 1000);
		});
	}
}

@Component({
	selector: "app-root",
	imports: [AlertComponent],
	template: `
		<div>
			<!-- Try clicking and unclicking quickly -->
			<button (click)="toggle()">Toggle</button>
			<!-- Binding to an event -->
			@if (show()) {
				<app-alert (alert)="alertUser()" />
			}
		</div>
	`,
})
class AppComponent {
	show = signal(false);

	toggle() {
		this.show.set(!this.show());
	}

	alertUser() {
		alert("I am an alert!");
	}
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
