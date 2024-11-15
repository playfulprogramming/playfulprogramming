import { bootstrapApplication } from "@angular/platform-browser";

import {
	afterRenderEffect,
	Component,
	ElementRef,
	viewChild,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "paragraph-tag",
	template: `
		@if (true) {
			<p #pTag>Hello, world!</p>
		}
	`,
})
class RenderParagraphComponent {
	pTag = viewChild.required("pTag", { read: ElementRef<HTMLElement> });

	constructor() {
		afterRenderEffect(() => {
			console.log(this.pTag().nativeElement);
		});
	}
}

bootstrapApplication(RenderParagraphComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
