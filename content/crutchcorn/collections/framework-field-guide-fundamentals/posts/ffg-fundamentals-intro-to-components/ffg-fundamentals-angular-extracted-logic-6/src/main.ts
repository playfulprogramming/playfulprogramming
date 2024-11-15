import {
	Component,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";

@Component({
	selector: "file-date",
	template: `<span>12/03/21</span>`,
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

bootstrapApplication(FileDateComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
