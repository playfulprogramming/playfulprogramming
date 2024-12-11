import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	effect,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "file-date",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<span>12/03/21</span>`,
})
class FileDateComponent {
	dateStr = formatDate();

	constructor() {
		effect(() => {
			console.log(this.dateStr);
		});
	}
}

function formatDate() {
	const today = new Date();
	// Month starts at 0, annoyingly
	const monthNum = today.getMonth() + 1;
	const dateNum = today.getDate();
	const yearNum = today.getFullYear();
	return monthNum + "/" + dateNum + "/" + yearNum;
}

bootstrapApplication(FileDateComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
