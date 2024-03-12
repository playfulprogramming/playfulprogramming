import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { Injectable, Component, inject, OnInit } from "@angular/core";
import { NgIf } from "@angular/common";

@Injectable()
class InjectedValue {
	message = "Hello, world";
}

@Component({
	selector: "child-comp",
	standalone: true,
	imports: [NgIf],
	template: `
		<div *ngIf="injectedValue">{{ injectedValue.message }}</div>
		<div *ngIf="!injectedValue">There is no injected value</div>
	`,
})
class ChildComponent implements OnInit {
	injectedValue = inject(InjectedValue, { optional: true });

	ngOnInit() {
		// undefined
		console.log(this.injectedValue);
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ChildComponent],
	template: `<child-comp />`,
})
class ParentComponent {}

bootstrapApplication(ParentComponent);
