import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ElementRef,
	afterRenderEffect,
	viewChild,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "paragraph-tag",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` @if (true) {
		<p #pTag>Hello, world!</p>
	}`,
})
class RenderParagraphComponent {
	pTag = viewChild.required("pTag", { read: ElementRef<HTMLElement> });

	constructor() {
		afterRenderEffect(() => {
			console.log(this.pTag());
		});
	}
}

bootstrapApplication(RenderParagraphComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
