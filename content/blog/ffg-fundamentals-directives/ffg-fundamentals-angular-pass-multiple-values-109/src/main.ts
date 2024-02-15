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

@Directive({
	selector: "[styleBackground]",
	standalone: true,
})
class StyleBackgroundDirective implements OnInit {
	@Input() r!: number;
	@Input() g!: number;
	@Input() b!: number;

	el = inject(ElementRef<any>);

	ngOnInit() {
		this.el.nativeElement.style.background = `rgb(${this.r}, ${this.g}, ${this.b})`;
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [StyleBackgroundDirective],
	template: `
		<button styleBackground [r]="255" [g]="174" [b]="174">Hello, world</button>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
