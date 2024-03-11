import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

@Component({
	selector: "paragraph-tag",
	standalone: true,
	template: ` <p #pTag>Hello, world!</p> `,
})
class RenderParagraphComponent implements OnInit {
	@ViewChild("pTag", { static: true }) pTag!: ElementRef<HTMLElement>;

	ngOnInit() {
		// This will output the HTML element
		console.log(this.pTag.nativeElement);
	}
}

bootstrapApplication(RenderParagraphComponent);
