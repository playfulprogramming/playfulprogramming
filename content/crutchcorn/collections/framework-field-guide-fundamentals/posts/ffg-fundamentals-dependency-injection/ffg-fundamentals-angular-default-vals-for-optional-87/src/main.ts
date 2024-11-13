import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { Injectable, Component, inject } from "@angular/core";

@Injectable()
class InjectedValue {
	message = "Initial value";
}

@Component({
	selector: "child-comp",
	template: `<p>{{ injectedValue.message }}</p>`,
})
class ChildComponent {
	injectedValue = inject(InjectedValue) || { message: "Default Value" };
}

@Component({
	selector: "app-root",
	imports: [ChildComponent],
	providers: [InjectedValue],
	template: ` <child-comp /> `,
})
class ParentComponent {}

bootstrapApplication(ParentComponent);
