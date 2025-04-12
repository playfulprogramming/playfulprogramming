import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	Input,
	EventEmitter,
	Output,
	OnInit,
	OnDestroy,
	signal,
	input,
	computed,
	output,
	effect,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "file-date",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<span [attr.aria-label]="labelText()">
			{{ dateStr() }}
		</span>
	`,
})
class FileDateComponent {
	inputDate = input.required<Date>();

	dateStr = computed(() => formatDate(this.inputDate()));
	labelText = computed(() => formatReadableDate(this.inputDate()));
}

@Component({
	selector: "file-item",
	imports: [FileDateComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<tr
			[attr.aria-selected]="isSelected()"
			(click)="selected.emit()"
			[style]="
				isSelected()
					? 'background-color: blue; color: white'
					: 'background-color: white; color: blue'
			"
		>
			<td>
				<a [href]="href()" style="color: inherit">{{ fileName() }}</a>
			</td>
			@if (isFolder()) {
				<td>Type: Folder</td>
			} @else {
				<td>Type: File</td>
			}
			<td>
				@if (!isFolder()) {
					<file-date [inputDate]="inputDate()" />
				}
			</td>
		</tr>
	`,
})
class FileComponent {
	fileName = input.required<string>();
	href = input.required<string>();
	isSelected = input(false);
	isFolder = input(false);
	selected = output();
	inputDate = signal(new Date());

	constructor() {
		effect((onCleanup) => {
			// Check if it's a new day every 10 minutes
			const interval = setInterval(
				() => {
					const newDate = new Date();
					if (this.inputDate().getDate() === newDate.getDate()) return;
					this.inputDate.set(newDate);
				},
				10 * 60 * 1000,
			);

			onCleanup(() => {
				clearInterval(interval);
			});
		});
	}
}

@Component({
	selector: "file-table-body",
	imports: [FileComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<tbody>
			@for (file of filesArray; track file.id; let i = $index) {
				@if (!file.isFolder) {
					<file-item
						(selected)="onSelected(i)"
						[isSelected]="selectedIndex() === i"
						[fileName]="file.fileName"
						[href]="file.href"
						[isFolder]="file.isFolder"
					/>
				}
			}
		</tbody>
	`,
})
class FileTableBody {
	selectedIndex = signal(-1);

	onSelected(idx: number) {
		if (this.selectedIndex() === idx) {
			this.selectedIndex.set(-1);
			return;
		}
		this.selectedIndex.set(idx);
	}

	onlyShowFiles = signal(false);

	toggleOnlyShow() {
		this.onlyShowFiles.set(!this.onlyShowFiles());
	}

	filesArray: File[] = [
		{
			fileName: "File one",
			href: "/file/file_one",
			isFolder: false,
			id: 1,
		},
		{
			fileName: "File two",
			href: "/file/file_two",
			isFolder: false,
			id: 2,
		},
		{
			fileName: "File three",
			href: "/file/file_three",
			isFolder: false,
			id: 3,
		},
		{
			fileName: "Folder one",
			href: "/file/folder_one/",
			isFolder: true,
			id: 4,
		},
		{
			fileName: "Folder two",
			href: "/file/folder_two/",
			isFolder: true,
			id: 5,
		},
	];
}

@Component({
	selector: "file-table",
	imports: [FileTableBody],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<table style="border-spacing: 0;">
			<file-table-body />
		</table>
	`,
})
class FileTableComponent {}

@Component({
	selector: "app-root",
	imports: [FileTableComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<file-table />`,
})
class AppComponent {}

interface File {
	fileName: string;
	href: string;
	isFolder: boolean;
	id: number;
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

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
