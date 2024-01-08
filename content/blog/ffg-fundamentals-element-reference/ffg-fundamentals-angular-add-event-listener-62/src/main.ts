import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	AfterViewInit,
	Component,
	ElementRef,
	ViewChild,
	OnDestroy,
} from "@angular/core";

@Component({
	selector: "paragraph-tag",
	standalone: true,
	template: `
		<button #btn>Add one</button>
		<p>Count is {{ count }}</p>
	`,
})
class RenderParagraphComponent implements AfterViewInit, OnDestroy {
	@ViewChild("btn") btn!: ElementRef<HTMLElement>;

	count = 0;

	addOne = () => {
		this.count++;
	};

	ngAfterViewInit() {
		this.btn.nativeElement.addEventListener("click", this.addOne);
	}

	ngOnDestroy() {
		this.btn.nativeElement.removeEventListener("click", this.addOne);
	}
}

bootstrapApplication(RenderParagraphComponent);
