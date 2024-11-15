import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	provideExperimentalZonelessChangeDetection,
	signal,
	input,
	output,
	afterRender,
} from "@angular/core";

@Component({
	selector: "file-date",
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
	template: `
		<button
			(click)="selected.emit()"
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
	// `href` is temporarily unused
	href = input.required<string>();
	isSelected = input<boolean>(false);
	selected = output();

	inputDate = new Date();
}

@Component({
	selector: "file-list",
	imports: [FileComponent],
	template: `
		<ul>
			<li>
				<file-item
					(selected)="onSelected(0)"
					[isSelected]="selectedIndex() === 0"
					fileName="File one"
					href="/file/file_one"
				/>
			</li>
			<li>
				<file-item
					(selected)="onSelected(1)"
					[isSelected]="selectedIndex() === 1"
					fileName="File two"
					href="/file/file_two"
				/>
			</li>
			<li>
				<file-item
					(selected)="onSelected(2)"
					[isSelected]="selectedIndex() === 2"
					fileName="File three"
					href="/file/file_three"
				/>
			</li>
		</ul>
	`,
})
class FileListComponent {
	selectedIndex = signal(-1);

	onSelected(idx: number) {
		if (this.selectedIndex() === idx) {
			this.selectedIndex.set(-1);
			return;
		}
		this.selectedIndex.set(idx);
	}
}

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
