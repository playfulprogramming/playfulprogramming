import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, effect, ErrorHandler } from "@angular/core";

const getErrorString = (err: unknown) =>
	JSON.stringify(err, Object.getOwnPropertyNames(err));

class MyErrorHandler implements ErrorHandler {
	handleError(error: unknown) {
		// Do something with the error
		alert(getErrorString(error));
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
	template: `<child-comp />`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [{ provide: ErrorHandler, useClass: MyErrorHandler }],
});
