import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";

@Component({
	selector: "file-date",
	standalone: true,
	template: `<span>12/03/21</span>`,
})
class FileDateComponent {}

@Component({
	selector: "file",
	standalone: true,
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
	standalone: true,
	imports: [FileComponent],
	template: `
		<ul>
			<li><file /></li>
			<li><file /></li>
			<li><file /></li>
		</ul>
	`,
})
class FileListComponent {}

bootstrapApplication(FileListComponent);
