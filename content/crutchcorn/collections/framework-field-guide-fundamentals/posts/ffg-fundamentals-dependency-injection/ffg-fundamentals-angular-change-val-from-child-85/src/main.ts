import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { Injectable, Component, inject, OnInit } from "@angular/core";

@Injectable()
class InjectedValue {
	message = "Hello, world";
	// `this` is referring to the `InjectedValue` instance
	changeMessage(val: string) {
		this.message = val;
	}
}

@Component({
	selector: "child-comp",
	standalone: true,
	template: `
		<div>{{ injectedValue.message }}</div>
		<button (click)="changeMessage()">Change message</button>
	`,
})
class ChildComponent {
	injectedValue = inject(InjectedValue);

	changeMessage() {
		// This will update the value of the class, and
		// re-render the component to reflect the new value
		this.injectedValue.changeMessage("Updated value");
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ChildComponent],
	providers: [InjectedValue],
	template: `<child-comp />`,
})
class ParentComponent {}

bootstrapApplication(ParentComponent);
