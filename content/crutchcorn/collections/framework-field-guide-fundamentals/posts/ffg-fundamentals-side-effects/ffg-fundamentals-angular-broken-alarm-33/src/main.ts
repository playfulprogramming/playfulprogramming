import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, OnInit, EventEmitter, Output } from "@angular/core";

@Component({
	selector: "alarm-screen",
	standalone: true,
	template: `
		<div>
			<p>Time to wake up!</p>
			<button (click)="snooze.emit()">Snooze for 5 seconds</button>
			<button (click)="disable.emit()">Turn off alarm</button>
		</div>
	`,
})
class AlarmScreenComponent implements OnInit {
	@Output() snooze = new EventEmitter();
	@Output() disable = new EventEmitter();

	ngOnInit() {
		setTimeout(() => {
			// Automatically snooze the alarm
			// after 10 seconds of inactivity
			// In production, this would be 10 minutes
			this.snooze.emit();
		}, 10 * 1000);
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [AlarmScreenComponent],
	template: `
		@if (!timerEnabled) {
			<p>There is no timer</p>
		} @else if (secondsLeft === 0) {
			<alarm-screen (snooze)="snooze()" (disable)="disable()" />
		} @else {
			<p>{{ secondsLeft }} seconds left in timer</p>
		}
	`,
})
class AppComponent implements OnInit {
	secondsLeft = 5;
	timerEnabled = true;

	ngOnInit() {
		setInterval(() => {
			if (this.secondsLeft === 0) return;
			this.secondsLeft = this.secondsLeft - 1;
		}, 1000);
	}

	snooze() {
		// In production, this would add 5 minutes, not 5 seconds
		this.secondsLeft = this.secondsLeft + 5;
	}

	disable() {
		this.timerEnabled = false;
	}
}

bootstrapApplication(AppComponent);
