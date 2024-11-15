import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, OnInit } from "@angular/core";

@Component({
	selector: "file-date",
	standalone: true,
	template: `<span [attr.aria-label]="labelText">{{ dateStr }}</span>`,
})
class FileDateComponent implements OnInit {
	dateStr = this.formatDate(new Date());
	labelText = this.formatReadableDate(new Date());

	ngOnInit() {
		setTimeout(() => {
			// 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
			const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
			this.dateStr = this.formatDate(tomorrow);
			this.labelText = this.formatReadableDate(tomorrow);
		}, 5000);
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

bootstrapApplication(FileDateComponent);
