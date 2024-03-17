import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { NgIf } from "@angular/common";

@Component({
	selector: "paragraph-tag",
	standalone: true,
	imports: [NgIf],
	template: `
		<ng-container *ngIf="true">
			<p #pTag>Hello, world!</p>
		</ng-container>
	`,
})
class RenderParagraphComponent implements AfterViewInit {
	@ViewChild("pTag") pTag!: ElementRef<HTMLElement>;

	ngAfterViewInit() {
		console.log(this.pTag.nativeElement);
	}
}

bootstrapApplication(RenderParagraphComponent);
