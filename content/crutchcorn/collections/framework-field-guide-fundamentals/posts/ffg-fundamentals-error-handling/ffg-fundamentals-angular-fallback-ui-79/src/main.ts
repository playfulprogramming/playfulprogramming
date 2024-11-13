import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	inject,
	ErrorHandler,
	OnInit,
	effect,
	signal,
} from "@angular/core";

class MyErrorHandler implements ErrorHandler {
	hadError = signal(false);

	handleError(error: unknown) {
		console.log(error);
		this.hadError.set(true);
	}
}

@Component({
	selector: "child-comp",
	template: `<p>Testing</p>`,
})
class ChildComponent {
	constructor() {
		effect(() => {
			throw new Error("Test");
		});
	}
}

@Component({
	selector: "app-root",
	imports: [ChildComponent],
	template: `
		@if (errorHandler.hadError()) {
			<p>There was an error</p>
		}
		@if (!errorHandler.hadError()) {
			<child-comp />
		}
	`,
})
class AppComponent {
	errorHandler = inject(ErrorHandler) as MyErrorHandler;
}

bootstrapApplication(AppComponent, {
	providers: [{ provide: ErrorHandler, useClass: MyErrorHandler }],
});
