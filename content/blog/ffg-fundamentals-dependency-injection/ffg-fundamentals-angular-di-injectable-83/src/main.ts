import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { Injectable, Component, inject, OnInit } from "@angular/core";

@Injectable()
class InjectedValue {
	message = "Hello, world";
}

@Component({
	selector: "child-comp",
	standalone: true,
	template: `<div>{{ injectedValue.message }}</div>`,
})
class ChildComponent implements OnInit {
	injectedValue = inject(InjectedValue);

	ngOnInit() {
		console.log(this.injectedValue);
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ChildComponent],
	providers: [InjectedValue],
	template: `<child-comp />`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
