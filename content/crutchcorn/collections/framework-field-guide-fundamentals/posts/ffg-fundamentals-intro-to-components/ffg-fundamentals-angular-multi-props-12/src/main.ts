import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
	input,
	signal,
} from "@angular/core";

@Component({
	selector: "file-date",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<span [attr.aria-label]="labelText()">{{ dateStr() }}</span>`,
})
class FileDateComponent implements OnInit {
	dateStr = signal(formatDate(new Date()));
	labelText = signal(formatReadableDate(new Date()));

	ngOnInit() {
		setTimeout(() => {
			// 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
			const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
			this.dateStr.set(formatDate(tomorrow));
			this.labelText.set(formatReadableDate(tomorrow));
		}, 5000);
	}
}

@Component({
	selector: "file-item",
	imports: [FileDateComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<a [attr.href]="href()">{{ fileName() }}<file-date /></a>
		</div>
	`,
})
class FileComponent {
	fileName = input.required<string>();
	href = input.required<string>();
}

@Component({
	selector: "file-list",
	imports: [FileComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ul>
			<li><file-item [fileName]="'File one'" [href]="'/file/file_one'" /></li>
			<li><file-item [fileName]="'File two'" [href]="'/file/file_two'" /></li>
			<li>
				<file-item [fileName]="'File three'" [href]="'/file/file_three'" />
			</li>
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
