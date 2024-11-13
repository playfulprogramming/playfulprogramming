import "zone.js";
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
	output,
	effect,
} from "@angular/core";
import { DatePipe } from "@angular/common";

@Component({
	selector: "file-date",
	imports: [DatePipe],
	template: `
		<span [attr.aria-label]="inputDate() | date: 'MMMM d, Y'">
			{{ inputDate() | date }}
		</span>
	`,
})
class FileDateComponent {
	inputDate = input.required<Date>();
}

@Component({
	selector: "file-item",
	imports: [FileDateComponent],
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
	isSelected = input.required<boolean>();
	isFolder = input.required<boolean>();
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
	template: `<file-table />`,
})
class AppComponent {}

interface File {
	fileName: string;
	href: string;
	isFolder: boolean;
	id: number;
}

bootstrapApplication(AppComponent);
