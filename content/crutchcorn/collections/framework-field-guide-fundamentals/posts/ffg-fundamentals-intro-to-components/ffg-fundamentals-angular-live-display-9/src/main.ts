import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	effect,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
	signal,
} from "@angular/core";

@Component({
	selector: "file-date",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<span>{{ dateStr() }}</span>`,
})
class FileDateComponent {
	dateStr = signal(formatDate(new Date()));

	constructor() {
		effect(() => {
			setTimeout(() => {
				// 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
				const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
				this.dateStr.set(formatDate(tomorrow));
			}, 5000);
		});
	}
}

function formatDate(inputDate: Date) {
	// Month starts at 0, annoyingly
	const monthNum = inputDate.getMonth() + 1;
	const dateNum = inputDate.getDate();
	const yearNum = inputDate.getFullYear();
	return monthNum + "/" + dateNum + "/" + yearNum;
}

bootstrapApplication(FileDateComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
