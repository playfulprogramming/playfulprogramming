import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	inject,
	ElementRef,
	Directive,
	effect,
	input,
} from "@angular/core";

@Directive({
	selector: "[styleBackground]",
})
class StyleBackgroundDirective {
	r = input.required<number>();
	g = input.required<number>();
	b = input.required<number>();

	el = inject(ElementRef<any>);

	constructor() {
		effect(() => {
			this.el.nativeElement.style.background = `rgb(${this.r()}, ${this.g()}, ${this.b()})`;
		});
	}
}

@Component({
	selector: "app-root",
	imports: [StyleBackgroundDirective],
	template: `
		<button styleBackground [r]="255" [g]="174" [b]="174">Hello, world</button>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
