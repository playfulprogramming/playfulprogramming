import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ElementRef,
	signal,
	afterRenderEffect,
	viewChild,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "paragraph-tag",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button #btn>Add one</button>
		<p>Count is {{ count() }}</p>
	`,
})
class RenderParagraphComponent {
	btn = viewChild.required("btn", { read: ElementRef<HTMLElement> });

	count = signal(0);

	addOne = () => {
		this.count.set(this.count() + 1);
	};

	constructor() {
		afterRenderEffect((onCleanup) => {
			this.btn().nativeElement.addEventListener("click", this.addOne);
			onCleanup(() => {
				this.btn().nativeElement.removeEventListener("click", this.addOne);
			});
		});
	}
}

bootstrapApplication(RenderParagraphComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
