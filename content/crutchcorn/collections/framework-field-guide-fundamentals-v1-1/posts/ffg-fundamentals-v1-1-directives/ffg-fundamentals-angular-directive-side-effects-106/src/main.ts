import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	inject,
	ElementRef,
	Directive,
	OnInit,
} from "@angular/core";

@Directive({
	selector: "[focusElement]",
	standalone: true,
})
class StyleBackgroundDirective implements OnInit {
	el = inject(ElementRef<any>);

	ngOnInit() {
		this.el.nativeElement.focus();
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [StyleBackgroundDirective],
	template: ` <button focusElement>Hello, world</button> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
