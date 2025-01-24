import {
	Component,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";

@Component({
	selector: "file-item",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<a href="/file/file_one">File one<span>12/03/21</span></a>
		</div>
	`,
})
class FileComponent {}

bootstrapApplication(FileComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
