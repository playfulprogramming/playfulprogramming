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
	 * You cannot access `Input` data from the root (constructor)
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
			@if (isFolder()) {
				<span>Type: Folder</span>
			} @else {
				<span>Type: File</span>
			}
			@if (!isFolder()) {
				<file-date [inputDate]="inputDate" />
			}
		</button>
	`,
})
class FileComponent {
	fileName = input.required<string>();
	href = input.required<string>();
	isSelected = input(false);
	isFolder = input(false);
	selected = output();

	inputDate = new Date();
}

@Component({
	selector: "file-list",
	imports: [FileComponent],
	template: `
		<ul>
			@for (file of filesArray; track file; let i = $index) {
				<li>
					<file-item
						(selected)="onSelected(i)"
						[isSelected]="selectedIndex() === i"
						[fileName]="file.fileName"
						[href]="file.href"
						[isFolder]="file.isFolder"
					/>
				</li>
			}
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

	filesArray = [
		{
			fileName: "File one",
			href: "/file/file_one",
			isFolder: false,
		},
		{
			fileName: "File two",
			href: "/file/file_two",
			isFolder: false,
		},
		{
			fileName: "File three",
			href: "/file/file_three",
			isFolder: false,
		},
	];
}

function formatDate(inputDate: Date) {
	// Month starts at 0, annoyingly
	const monthNum = inputDate.getMonth() + 1;
	const dateNum = inputDate.getDate();
	const yearNum = inputDate.getFullYear();
	return monthNum + "/" + dateNum + "/" + yearNum;
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

bootstrapApplication(FileListComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
