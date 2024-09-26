import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, OnInit } from "@angular/core";

@Component({
	selector: "clock-comp",
	standalone: true,
	template: ` <p role="timer">Time is: {{ time }}</p> `,
})
class ClockComponent implements OnInit {
	time = formatDate(new Date());

	ngOnInit() {
		setInterval(() => {
			console.log("I am updating the time");
			this.time = formatDate(new Date());
		}, 1000);
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
	standalone: true,
	imports: [ClockComponent],
	template: `
		<div>
			<button (click)="setShowClock(!showClock)">Toggle clock</button>
			@if (showClock) {
				<clock-comp />
			}
		</div>
	`,
})
class AppComponent {
	showClock = true;

	setShowClock(val: boolean) {
		this.showClock = val;
	}
}

bootstrapApplication(AppComponent);
