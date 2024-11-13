import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, inject, ErrorHandler, signal, effect } from "@angular/core";

class MyErrorHandler implements ErrorHandler {
	error = signal<unknown>(null);

	handleError(error: unknown) {
		console.log(error);
		this.error.set(error);
	}
}

@Component({
	selector: "child-comp",
	template: `<p>Testing</p>`,
})
class ChildComponent {
	constructor() {
		effect(() => {
			// This is an example of an error being thrown
			throw new Error("Test");
		});
	}
}

@Component({
	selector: "app-root",
	imports: [ChildComponent],
	template: `
		@if (errorHandler.error()) {
			<div>
				<h1>You got an error:</h1>
				<pre
					style="white-space: pre-wrap"
				><code>{{ errorHandler.error() }}</code></pre>
			</div>
		}
		@if (!errorHandler.error()) {
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
