import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";

@Component({
	selector: "file-date",
	standalone: true,
	template: `<span>{{ dateStr }}</span>`,
})
class FileDateComponent {
	dateStr = this.formatDate();

	formatDate() {
		const today = new Date();
		// Month starts at 0, annoyingly
		const monthNum = today.getMonth() + 1;
		const dateNum = today.getDate();
		const yearNum = today.getFullYear();
		return monthNum + "/" + dateNum + "/" + yearNum;
	}
}

bootstrapApplication(FileDateComponent);
