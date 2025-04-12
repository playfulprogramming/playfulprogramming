import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	Directive,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Directive({
	selector: "[sayHi]",
})
class LogElementDirective {
	constructor() {
		console.log("Hello, world!");
	}
}

@Component({
	selector: "app-root",
	imports: [LogElementDirective],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <p sayHi>Hello, world</p> `,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
