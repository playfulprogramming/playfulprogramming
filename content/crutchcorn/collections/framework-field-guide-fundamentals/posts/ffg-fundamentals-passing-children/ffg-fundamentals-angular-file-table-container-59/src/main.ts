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
	effect,
	output,
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
	selector: "tr[file-item]",
	imports: [FileDateComponent],
	host: {
		"[attr.aria-selected]": "isSelected()",
		"(click)": "selected.emit()",
		"[style]": `
			isSelected() ?
				'background-color: blue; color: white' :
				'background-color: white; color: blue'
		`,
	},
	template: `
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
	selector: "tbody[file-table-body]",
	imports: [FileComponent],
	template: `
		@for (file of filesArray; track file.id; let i = $index) {
			@if (onlyShowFiles() ? !file.isFolder : true) {
				<tr
					file-item
					(selected)="onSelected(i)"
					[isSelected]="selectedIndex() === i"
					[fileName]="file.fileName"
					[href]="file.href"
					[isFolder]="file.isFolder"
				></tr>
			}
		}
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

	onlyShowFiles = input(false);

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
	selector: "file-table-container",
	template: `
		<table
			style="color: #3366FF; border: 2px solid #3366FF; border-spacing: 0; padding: 0.5rem"
		>
			<ng-content></ng-content>
		</table>
	`,
})
class FileTableContainerComponent {}

@Component({
	selector: "file-table",
	imports: [FileTableContainerComponent, FileTableBody],
	template: `
		<div>
			<button (click)="toggleOnlyShow()" style="margin-bottom: 1rem">
				Only show files
			</button>
			<file-table-container>
				<tbody file-table-body [onlyShowFiles]="onlyShowFiles()"></tbody>
			</file-table-container>
		</div>
	`,
})
class FileTableComponent {
	onlyShowFiles = signal(false);

	toggleOnlyShow() {
		this.onlyShowFiles.set(!this.onlyShowFiles());
	}
}

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
