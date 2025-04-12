import {
	Component,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";

@Component({
	selector: "file-date",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<span>12/03/21</span>`,
})
class FileDateComponent {
	dateStr = `${
		new Date().getMonth() + 1
	}/${new Date().getDate()}/${new Date().getFullYear()}`;
}

bootstrapApplication(FileDateComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
