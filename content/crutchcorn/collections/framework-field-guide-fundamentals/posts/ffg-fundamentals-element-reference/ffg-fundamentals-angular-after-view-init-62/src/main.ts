import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

@Component({
	selector: "paragraph-tag",
	standalone: true,
	imports: [],
	template: `
		@if (true) {
			<p #pTag>Hello, world!</p>
		}
	`,
})
class RenderParagraphComponent implements AfterViewInit {
	@ViewChild("pTag") pTag!: ElementRef<HTMLElement>;

	ngAfterViewInit() {
		console.log(this.pTag.nativeElement);
	}
}

bootstrapApplication(RenderParagraphComponent);
