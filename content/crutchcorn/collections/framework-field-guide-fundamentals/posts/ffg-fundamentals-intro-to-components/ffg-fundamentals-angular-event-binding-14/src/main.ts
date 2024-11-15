import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
	input,
	signal,
	afterRender,
} from "@angular/core";

@Component({
	selector: "file-date",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<span [attr.aria-label]="labelText()">{{ dateStr() }}</span>`,
})
class FileDateComponent {
	inputDate = input.required<Date>();

	/**
	 * You cannot access `input` data from the root (constructor)
	 * of the class
	 */
	dateStr = signal("");
	labelText = signal("");

	constructor() {
		afterRender(() => {
			this.dateStr.set(formatDate(this.inputDate()));
			this.labelText.set(formatReadableDate(this.inputDate()));
		});
	}
}

@Component({
	selector: "file-item",
	imports: [FileDateComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button
			(click)="selectFile()"
			[style]="
				isSelected()
					? 'background-color: blue; color: white'
					: 'background-color: white; color: blue'
			"
		>
			{{ fileName() }}
			<file-date [inputDate]="inputDate" />
		</button>
	`,
})
class FileComponent {
	fileName = input.required<string>();
	inputDate = new Date();

	isSelected = signal(false);

	selectFile() {
		this.isSelected.set(!this.isSelected());
	}
}

@Component({
	selector: "file-list",
	imports: [FileComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
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
