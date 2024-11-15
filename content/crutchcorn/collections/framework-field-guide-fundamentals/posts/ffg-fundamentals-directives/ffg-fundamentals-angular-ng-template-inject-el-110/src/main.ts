import { bootstrapApplication } from "@angular/platform-browser";

import {
	Directive,
	Component,
	inject,
	ElementRef,
	effect,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Directive({
	selector: "[beOnTemplate]",
})
class TemplateDirective {
	el = inject(ElementRef<any>);
	constructor() {
		effect(() => {
			// This will log a "Comment"
			console.log(this.el.nativeElement);
		});
	}
}

@Component({
	selector: "app-root",
	imports: [TemplateDirective],
	template: ` <ng-template beOnTemplate><p>Hello, world</p></ng-template> `,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
