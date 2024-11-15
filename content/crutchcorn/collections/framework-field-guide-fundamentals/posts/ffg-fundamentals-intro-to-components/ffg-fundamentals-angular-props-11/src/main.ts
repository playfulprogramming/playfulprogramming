import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	provideExperimentalZonelessChangeDetection,
	input,
	effect,
	signal,
} from "@angular/core";

@Component({
	selector: "file-date",
	template: `<span [attr.aria-label]="labelText()">{{ dateStr() }}</span>`,
})
class FileDateComponent {
	dateStr = signal(formatDate(new Date()));
	labelText = signal(formatReadableDate(new Date()));

	constructor() {
		effect(() => {
			setTimeout(() => {
				// 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
				const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
				this.dateStr.set(formatDate(tomorrow));
				this.labelText.set(formatReadableDate(tomorrow));
			}, 5000);
		});
	}
}

@Component({
	selector: "file-item",
	imports: [FileDateComponent],
	template: `
		<div>
			<a href="/file/file_one">{{ fileName() }}<file-date /></a>
		</div>
	`,
})
class FileComponent {
	fileName = input.required<string>();
}

@Component({
	selector: "file-list",
	imports: [FileComponent],
	template: `
		<ul>
			<li><file-item [fileName]="'File one'" /></li>
			<li><file-item [fileName]="'File two'" /></li>
			<li><file-item [fileName]="'File three'" /></li>
		</ul>
	`,
})
class FileListComponent {}

function formatDate(inputDate: Date) {
	// Month starts at 0, annoyingly
	const monthNum = inputDate.getMonth() + 1;
	const dateNum = inputDate.getDate();
	const yearNum = inputDate.getFullYear();
	return monthNum + "/" + dateNum + "/" + yearNum;
}

function dateSuffix(dayNumber: number) {
	const lastDigit = dayNumber % 10;
	if (lastDigit == 1 && dayNumber != 11) {
		return dayNumber + "st";
	}
	if (lastDigit == 2 && dayNumber != 12) {
		return dayNumber + "nd";
	}
	if (lastDigit == 3 && dayNumber != 13) {
		return dayNumber + "rd";
	}
	return dayNumber + "th";
}

function formatReadableDate(inputDate: Date) {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const monthStr = months[inputDate.getMonth()];
	const dateSuffixStr = dateSuffix(inputDate.getDate());
	const yearNum = inputDate.getFullYear();
	return monthStr + " " + dateSuffixStr + "," + yearNum;
}

bootstrapApplication(FileListComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
