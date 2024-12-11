import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, OnInit } from "@angular/core";

@Component({
	selector: "file-date",
	standalone: true,
	template: `<span>{{ dateStr }}</span>`,
})
class FileDateComponent implements OnInit {
	dateStr = this.formatDate(new Date());

	ngOnInit() {
		setTimeout(() => {
			// 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
			const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
			this.dateStr = this.formatDate(tomorrow);
		}, 5000);
	}

	formatDate(inputDate: Date) {
		// Month starts at 0, annoyingly
		const monthNum = inputDate.getMonth() + 1;
		const dateNum = inputDate.getDate();
		const yearNum = inputDate.getFullYear();
		return monthNum + "/" + dateNum + "/" + yearNum;
	}
}

bootstrapApplication(FileDateComponent);
