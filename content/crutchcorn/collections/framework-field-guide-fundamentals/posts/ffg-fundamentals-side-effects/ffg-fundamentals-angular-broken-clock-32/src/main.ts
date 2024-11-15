import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	effect,
	signal,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "clock-comp",
	template: ` <p role="timer">Time is: {{ time() }}</p> `,
})
class ClockComponent {
	time = signal(formatDate(new Date()));

	constructor() {
		effect(() => {
			setInterval(() => {
				console.log("I am updating the time");
				this.time.set(formatDate(new Date()));
			}, 1000);
		});
	}
}

function formatDate(date: Date) {
	return (
		prefixZero(date.getHours()) +
		":" +
		prefixZero(date.getMinutes()) +
		":" +
		prefixZero(date.getSeconds())
	);
}

function prefixZero(number: number) {
	if (number < 10) {
		return "0" + number.toString();
	}

	return number.toString();
}

@Component({
	selector: "app-root",
	imports: [ClockComponent],
	template: `
		<div>
			<button (click)="setShowClock(!showClock())">Toggle clock</button>
			@if (showClock()) {
				<clock-comp />
			}
		</div>
	`,
})
class AppComponent {
	showClock = signal(true);

	setShowClock(val: boolean) {
		this.showClock.set(val);
	}
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
