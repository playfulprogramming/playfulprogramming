import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Directive,
	Component,
	OnInit,
	Input,
	inject,
	ElementRef,
} from "@angular/core";

@Directive({
	selector: "[beOnTemplate]",
	standalone: true,
})
class TemplateDirective implements OnInit {
	el = inject(ElementRef<any>);
	ngOnInit() {
		// This will log a "Comment"
		console.log(this.el.nativeElement);
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [TemplateDirective],
	template: ` <ng-template beOnTemplate><p>Hello, world</p></ng-template> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
