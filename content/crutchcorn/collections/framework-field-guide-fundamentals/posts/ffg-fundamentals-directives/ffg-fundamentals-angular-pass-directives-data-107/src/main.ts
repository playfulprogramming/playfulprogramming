import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	inject,
	ElementRef,
	Directive,
	effect,
	input,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Directive({
	selector: "[styleBackground]",
})
class StyleBackgroundDirective {
	styleBackground = input.required<string>();

	el = inject(ElementRef<any>);

	constructor() {
		effect(() => {
			this.el.nativeElement.style.background = this.styleBackground();
		});
	}
}

@Component({
	selector: "app-root",
	imports: [StyleBackgroundDirective],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <button styleBackground="#FFAEAE">Hello, world</button> `,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
