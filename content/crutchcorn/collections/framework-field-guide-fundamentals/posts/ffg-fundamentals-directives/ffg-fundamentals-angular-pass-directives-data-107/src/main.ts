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
	@Input() styleBackground!: string;

	el = inject(ElementRef<any>);

	ngOnInit() {
		this.el.nativeElement.style.background = this.styleBackground;
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [StyleBackgroundDirective],
	template: ` <button styleBackground="#FFAEAE">Hello, world</button> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
