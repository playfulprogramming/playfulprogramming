import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { Injectable, Component, inject, signal } from "@angular/core";

@Injectable()
class InjectedValue {
	message = signal("Initial value");
}

@Component({
	selector: "child-comp",
	template: `<p>{{ injectedValue.message() }}</p>`,
})
class ChildComponent {
	injectedValue = inject(InjectedValue);
}

@Component({
	selector: "app-root",
	imports: [ChildComponent],
	providers: [InjectedValue],
	template: `
		<child-comp />
		<button (click)="updateMessage()">Update the message</button>
	`,
})
class AppComponent {
	// We can access the `injectedValue` from the same component we provide it from
	injectedValue = inject(InjectedValue);

	updateMessage() {
		this.injectedValue.message.set("Updated value");
	}
}

bootstrapApplication(AppComponent);
