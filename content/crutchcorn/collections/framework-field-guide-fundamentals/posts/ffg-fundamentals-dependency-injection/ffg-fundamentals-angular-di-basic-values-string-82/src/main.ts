import { bootstrapApplication } from "@angular/platform-browser";
import {
	InjectionToken,
	Component,
	inject,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

const WELCOME_MESSAGE_TOKEN = new InjectionToken<string>("WELCOME_MESSAGE");

@Component({
	selector: "child-comp",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<p>{{ welcomeMsg }}</p>`,
})
class ChildComponent {
	welcomeMsg: string = inject(WELCOME_MESSAGE_TOKEN);

	constructor() {
		console.log(this.welcomeMsg);
	}
}

@Component({
	selector: "app-root",
	imports: [ChildComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<child-comp />`,
	providers: [{ provide: WELCOME_MESSAGE_TOKEN, useValue: "Hello, world!" }],
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
