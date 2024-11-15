import {
	Component,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";

@Component({
	selector: "file",
	template: `
		<div>
			<a href="/file/file_one">File one<span>12/03/21</span></a>
		</div>
	`,
})
class FileComponent {}

@Component({
	selector: "file-list",
	imports: [FileComponent],
	template: `
		<ul>
			<li><file /></li>
		</ul>
	`,
})
class FileListComponent {}

bootstrapApplication(FileListComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
