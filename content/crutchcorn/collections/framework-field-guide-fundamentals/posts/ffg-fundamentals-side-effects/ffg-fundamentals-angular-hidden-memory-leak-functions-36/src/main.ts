import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	signal,
	effect,
	input,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "app-alert",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <p>Showing alert...</p> `,
})
class AlertComponent {
	alert = input.required<() => void>();

	constructor() {
		effect(() => {
			setTimeout(() => {
				const alertFn = this.alert();
				alertFn();
			}, 1000);
		});
	}
}

@Component({
	selector: "app-root",
	imports: [AlertComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button (click)="toggle()">Toggle</button>
		@if (show()) {
			<app-alert [alert]="alertUser" />
		}
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
