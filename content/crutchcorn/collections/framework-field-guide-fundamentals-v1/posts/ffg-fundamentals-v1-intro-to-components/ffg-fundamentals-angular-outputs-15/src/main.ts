import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Input, EventEmitter, Output, OnInit } from "@angular/core";

@Component({
	selector: "file-date",
	standalone: true,
	template: `<span [attr.aria-label]="labelText">{{ dateStr }}</span>`,
})
class FileDateComponent implements OnInit {
	@Input() inputDate!: Date;

	/**
	 * You cannot access `Input` data from the root (constructor)
	 * of the class
	 */
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
			<file-date [inputDate]="inputDate" />
		</button>
	`,
})
class FileComponent {
	@Input() fileName!: string;
	// `href` is temporarily unused
	@Input() href!: string;
	@Input() isSelected!: boolean;
	@Output() selected = new EventEmitter();

	inputDate = new Date();
}

@Component({
	selector: "file-list",
	standalone: true,
	imports: [FileComponent],
	template: `
		<ul>
			<li>
				<file-item
					(selected)="onSelected(0)"
					[isSelected]="selectedIndex === 0"
					fileName="File one"
					href="/file/file_one"
				/>
			</li>
			<li>
				<file-item
					(selected)="onSelected(1)"
					[isSelected]="selectedIndex === 1"
					fileName="File two"
					href="/file/file_two"
				/>
			</li>
			<li>
				<file-item
					(selected)="onSelected(2)"
					[isSelected]="selectedIndex === 2"
					fileName="File three"
					href="/file/file_three"
				/>
			</li>
		</ul>
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
}

bootstrapApplication(FileListComponent);
