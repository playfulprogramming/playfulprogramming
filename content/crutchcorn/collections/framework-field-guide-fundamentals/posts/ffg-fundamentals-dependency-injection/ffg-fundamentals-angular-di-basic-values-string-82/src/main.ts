import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { InjectionToken, Component, inject } from "@angular/core";

const WELCOME_MESSAGE_TOKEN = new InjectionToken<string>("WELCOME_MESSAGE");

@Component({
	selector: "child-comp",
	standalone: true,
	template: `<p>{{ welcomeMsg }}</p>`,
})
class ChildComponent {
	welcomeMsg: string = inject(WELCOME_MESSAGE_TOKEN);

	ngOnInit() {
		console.log(this.welcomeMsg);
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ChildComponent],
	template: `<child-comp />`,
	providers: [{ provide: WELCOME_MESSAGE_TOKEN, useValue: "Hello, world!" }],
})
class AppComponent {}

bootstrapApplication(AppComponent);
