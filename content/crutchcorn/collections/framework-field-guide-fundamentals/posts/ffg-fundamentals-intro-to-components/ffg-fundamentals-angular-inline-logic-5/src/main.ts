import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";

@Component({
	selector: "file-date",
	standalone: true,
	template: `<span>12/03/21</span>`,
})
class FileDateComponent {
	dateStr = `${
		new Date().getMonth() + 1
	}/${new Date().getDate()}/${new Date().getFullYear()}`;
}

bootstrapApplication(FileDateComponent);
