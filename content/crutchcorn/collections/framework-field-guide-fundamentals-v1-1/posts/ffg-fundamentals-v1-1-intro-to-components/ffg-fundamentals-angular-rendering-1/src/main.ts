// Required by Angular to work, feel free to ignore
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";

@Component({
	selector: "file",
	standalone: true,
	template: `
		<div>
			<a href="/file/file_one">File one<span>12/03/21</span></a>
		</div>
	`,
})
class FileComponent {}

bootstrapApplication(FileComponent);
