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
import { NgFor, NgIf, DatePipe } from "@angular/common";

@Component({
	selector: "file-date",
	standalone: true,
	imports: [DatePipe],
	template: `
		<span [attr.aria-label]="inputDate | date: 'MMMM d, Y'">
			{{ inputDate | date }}
		</span>
	`,
})
class FileDateComponent {
	@Input() inputDate!: Date;
}

@Component({
	selector: "tr[file-item]",
	standalone: true,
	imports: [FileDateComponent, NgIf],
	host: {
		"[attr.aria-selected]": "isSelected",
		"(click)": "selected.emit()",
		"[style]": `
			isSelected ?
				'background-color: blue; color: white' :
				'background-color: white; color: blue'
		`,
	},
	template: `
		<td>
			<a [href]="href" style="color: inherit">{{ fileName }}</a>
		</td>
		<td *ngIf="isFolder; else fileDisplay">Folder</td>
		<ng-template #fileDisplay><td>File</td></ng-template>
		<td><file-date *ngIf="!isFolder" [inputDate]="inputDate" /></td>
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
	selector: "tbody[file-table-body]",
	standalone: true,
	imports: [NgFor, NgIf, FileComponent],
	template: `
		<ng-container
			*ngFor="let file of filesArray; let i = index; trackBy: fileTrackBy"
		>
			<tr
				file-item
				*ngIf="onlyShowFiles ? !file.isFolder : true"
				(selected)="onSelected(i)"
				[isSelected]="selectedIndex === i"
				[fileName]="file.fileName"
				[href]="file.href"
				[isFolder]="file.isFolder"
			></tr>
		</ng-container>
	`,
})
class FileTableBody {
	selectedIndex = -1;

	fileTrackBy(index: number, file: File) {
		return file.id;
	}

	onSelected(idx: number) {
		if (this.selectedIndex === idx) {
			this.selectedIndex = -1;
			return;
		}
		this.selectedIndex = idx;
	}

	@Input() onlyShowFiles = false;

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
	standalone: true,
	template: `
		<table
			style="color: #3366FF; border: 2px solid #3366FF; border-spacing: 0; padding: 0.5rem"
		>
			<thead>
				<ng-content select="[header]"></ng-content>
			</thead>
			<ng-content></ng-content>
		</table>
	`,
})
class FileTableContainerComponent {}

@Component({
	selector: "file-table",
	standalone: true,
	imports: [NgFor, NgIf, FileTableContainerComponent, FileTableBody],
	template: `
		<div>
			<button (click)="toggleOnlyShow()" style="margin-bottom: 1rem">
				Only show files
			</button>
			<file-table-container>
				<tr header>
					<th>Name</th>
					<th>File Type</th>
					<th>Date</th>
				</tr>
				<tbody file-table-body [onlyShowFiles]="onlyShowFiles"></tbody>
			</file-table-container>
		</div>
	`,
})
class FileTableComponent {
	onlyShowFiles = false;

	toggleOnlyShow() {
		this.onlyShowFiles = !this.onlyShowFiles;
	}
}

@Component({
	selector: "app-root",
	standalone: true,
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
