import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ElementRef,
	effect,
	viewChild,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "paragraph-tag",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <p #pTag>Hello, world!</p> `,
})
class RenderParagraphComponent {
	pTag = viewChild.required("pTag", { read: ElementRef<HTMLElement> });

	constructor() {
		effect(() => {
			console.log(this.pTag());
		});
	}
}

bootstrapApplication(RenderParagraphComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
