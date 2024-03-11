import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, inject, ErrorHandler, OnInit } from "@angular/core";
import { NgIf } from "@angular/common";

class MyErrorHandler implements ErrorHandler {
	hadError = false;

	handleError(error: unknown) {
		console.log(error);
		this.hadError = true;
	}
}

@Component({
	selector: "child-comp",
	standalone: true,
	template: `<p>Testing</p>`,
})
class ChildComponent implements OnInit {
	ngOnInit() {
		// This is an example of an error being thrown
		throw new Error("Test");
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [NgIf, ChildComponent],
	template: `
		<p *ngIf="errorHandler.hadError">There was an error</p>
		<child-comp *ngIf="!errorHandler.hadError" />
	`,
})
class AppComponent {
	errorHandler = inject(ErrorHandler) as MyErrorHandler;
}

bootstrapApplication(AppComponent, {
	providers: [{ provide: ErrorHandler, useClass: MyErrorHandler }],
});
