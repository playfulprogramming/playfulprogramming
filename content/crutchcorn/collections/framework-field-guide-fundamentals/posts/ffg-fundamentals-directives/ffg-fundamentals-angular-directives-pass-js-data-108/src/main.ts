import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	inject,
	ElementRef,
	Directive,
	input,
	effect,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

class Color {
	r: number;
	g: number;
	b: number;

	constructor(r: number, g: number, b: number) {
		this.r = r;
		this.g = g;
		this.b = b;
	}
}

@Directive({
	selector: "[styleBackground]",
})
class StyleBackgroundDirective {
	styleBackground = input.required<Color>();

	el = inject(ElementRef<any>);

	constructor() {
		effect(() => {
			const color = this.styleBackground();
			this.el.nativeElement.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
		});
	}
}

@Component({
	selector: "app-root",
	imports: [StyleBackgroundDirective],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <button [styleBackground]="color">Hello, world</button> `,
})
class AppComponent {
	color = new Color(255, 174, 174);
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
