import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	effect,
	signal,
	output,
	input,
	computed,
} from "@angular/core";

@Component({
	selector: "file-date",
	template: `
		<span [attr.aria-label]="humanReadableDate()">
			{{ displayDate() }}
		</span>
	`,
})
class FileDateComponent {
	inputDate = input.required<Date>();

	displayDate = computed(() => {
		return new Intl.DateTimeFormat("en-US").format(this.inputDate());
	});

	humanReadableDate = computed(() => {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(this.inputDate());
	});
}

@Component({
	selector: "file-item",
	standalone: true,
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
				<file-date [inputDate]="inputDate()" />
			}
		</button>
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
	selector: "file-list",
	standalone: true,
	imports: [FileComponent],
	template: `
		<div>
			<button (click)="toggleOnlyShow()">Only show files</button>
			<ul>
				@for (file of filesArray; track file.id; let i = $index) {
					<li>
						@if (onlyShowFiles() ? !file.isFolder : true) {
							<file-item
								(selected)="onSelected(i)"
								[isSelected]="selectedIndex() === i"
								[fileName]="file.fileName"
								[href]="file.href"
								[isFolder]="file.isFolder"
							/>
						}
					</li>
				}
			</ul>
		</div>
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

interface File {
	fileName: string;
	href: string;
	isFolder: boolean;
	id: number;
}

bootstrapApplication(FileListComponent);
