import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	Input,
	EventEmitter,
	Output,
	OnInit,
	OnDestroy,
} from "@angular/core";

@Component({
	selector: "file-date",
	standalone: true,
	template: `<span [attr.aria-label]="labelText">{{ dateStr }}</span>`,
})
class FileDateComponent implements OnInit {
	@Input() inputDate!: Date;

	dateStr = "";
	labelText = "";

	ngOnInit() {
		this.dateStr = this.formatDate(this.inputDate);
		this.labelText = this.formatReadableDate(this.inputDate);
	}

	formatDate(inputDate: Date) {
		// Month starts at 0, annoyingly
		const monthNum = inputDate.getMonth() + 1;
		const dateNum = inputDate.getDate();
		const yearNum = inputDate.getFullYear();
		return monthNum + "/" + dateNum + "/" + yearNum;
	}

	dateSuffix(dayNumber: number) {
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

	formatReadableDate(inputDate: Date) {
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
}

@Component({
	selector: "file-item",
	standalone: true,
	imports: [FileDateComponent],
	template: `
		<button
			(click)="selected.emit()"
			[style]="
				isSelected
					? 'background-color: blue; color: white'
					: 'background-color: white; color: blue'
			"
		>
			{{ fileName }}
			@if (isFolder) {
				<span>Type: Folder</span>
			} @else {
				<span>Type: File</span>
			}
			<!-- This may not show the most up-to-date 'formatDate' or 'formatReadableDate' -->
			@if (!isFolder) {
				<file-date [inputDate]="inputDate" />
			}
		</button>
	`,
})
class FileComponent implements OnInit, OnDestroy {
	@Input() fileName!: string;
	@Input() href!: string;
	@Input() isSelected!: boolean;
	@Input() isFolder!: boolean;
	@Output() selected = new EventEmitter();
	inputDate = new Date();
	interval: any = null;

	ngOnInit() {
		// Check if it's a new day every 10 minutes
		this.interval = setInterval(
			() => {
				const newDate = new Date();
				if (this.inputDate.getDate() === newDate.getDate()) return;
				this.inputDate = newDate;
			},
			10 * 60 * 1000,
		);
	}

	ngOnDestroy() {
		clearInterval(this.interval);
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
						@if (onlyShowFiles ? !file.isFolder : true) {
							<file-item
								(selected)="onSelected(i)"
								[isSelected]="selectedIndex === i"
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
	selectedIndex = -1;

	onSelected(idx: number) {
		if (this.selectedIndex === idx) {
			this.selectedIndex = -1;
			return;
		}
		this.selectedIndex = idx;
	}

	onlyShowFiles = false;

	toggleOnlyShow() {
		this.onlyShowFiles = !this.onlyShowFiles;
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
