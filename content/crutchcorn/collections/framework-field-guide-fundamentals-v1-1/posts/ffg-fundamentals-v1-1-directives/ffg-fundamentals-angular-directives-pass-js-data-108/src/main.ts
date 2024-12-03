import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	inject,
	ElementRef,
	Directive,
	OnInit,
	Input,
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
	standalone: true,
})
class StyleBackgroundDirective implements OnInit {
	@Input() styleBackground!: Color;

	el = inject(ElementRef<any>);

	ngOnInit() {
		const color = this.styleBackground;
		this.el.nativeElement.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
	}
}

@Component({
	selector: "app-root",

	standalone: true,
	imports: [StyleBackgroundDirective],
	template: ` <button [styleBackground]="color">Hello, world</button> `,
})
class AppComponent {
	color = new Color(255, 174, 174);
}

bootstrapApplication(AppComponent);
