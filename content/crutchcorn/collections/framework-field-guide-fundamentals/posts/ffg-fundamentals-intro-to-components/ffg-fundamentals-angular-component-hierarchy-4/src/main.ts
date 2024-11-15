import {
	Component,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";

@Component({
	selector: "file-date",
	template: `<span>12/03/21</span>`,
})
class FileDateComponent {}

@Component({
	selector: "file-item",
	imports: [FileDateComponent],
	template: `
		<div>
			<a href="/file/file_one">File one<file-date /></a>
		</div>
	`,
})
class FileComponent {}

@Component({
	selector: "file-list",
	imports: [FileComponent],
	template: `
		<ul>
			<li><file-item /></li>
			<li><file-item /></li>
			<li><file-item /></li>
		</ul>
	`,
})
class FileListComponent {}

bootstrapApplication(FileListComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
