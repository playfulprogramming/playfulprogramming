import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, ViewChild } from "@angular/core";

@Component({
	selector: "child-comp",
	standalone: true,
	template: `<div
		style="height: 100px; width: 100px; background-color: red;"
	></div>`,
})
class ChildComponent {
	pi = 3.14;
	sayHi() {
		alert("Hello, world");
	}
}

@Component({
	selector: "parent-comp",
	standalone: true,
	imports: [ChildComponent],
	template: `
		<button (click)="sayHiFromChild()">Say hi</button>
		<child-comp #childVar />
	`,
})
class ParentComponent {
	@ViewChild("childVar") childComp!: ChildComponent;

	sayHiFromChild() {
		this.childComp.sayHi();
	}
}

bootstrapApplication(ParentComponent);
