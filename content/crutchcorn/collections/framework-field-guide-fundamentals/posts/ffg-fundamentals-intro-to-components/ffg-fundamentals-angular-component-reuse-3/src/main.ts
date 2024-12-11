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

@Component({
	selector: "file-list",
	imports: [FileComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
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
