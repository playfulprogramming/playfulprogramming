import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	inject,
	ElementRef,
	Directive,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

function injectElAndStyle() {
	const el = inject(ElementRef<any>);
	el.nativeElement.style.background = "red";
	return el;
}

@Directive({
	selector: "[styleBackground]",
})
class StyleBackgroundDirective {
	el = injectElAndStyle();
}

@Component({
	selector: "app-root",
	imports: [StyleBackgroundDirective],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <button styleBackground>Hello, world</button> `,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
