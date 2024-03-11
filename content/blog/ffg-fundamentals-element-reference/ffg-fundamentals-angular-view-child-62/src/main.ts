import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

@Component({
	selector: "paragraph-tag",
	standalone: true,
	template: `<p #pTag>Hello, world!</p>`,
})
class RenderParagraphComponent implements OnInit {
	@ViewChild("pTag") pTag!: ElementRef<HTMLElement>;

	ngOnInit() {
		// This will show `undefined`
		alert(this.pTag);
	}
}

bootstrapApplication(RenderParagraphComponent);
