import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	inject,
	ElementRef,
	Directive,
	afterRenderEffect,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Directive({
	selector: "[focusElement]",
})
class StyleBackgroundDirective {
	el = inject(ElementRef<any>);

	constructor() {
		afterRenderEffect(() => {
			this.el.nativeElement.focus();
		});
	}
}

@Component({
	selector: "app-root",
	imports: [StyleBackgroundDirective],
	template: ` <button focusElement>Hello, world</button> `,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
