import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	inject,
	ErrorHandler,
	OnInit,
	effect,
	signal,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
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
	changeDetection: ChangeDetectionStrategy.OnPush,
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
	changeDetection: ChangeDetectionStrategy.OnPush,
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
