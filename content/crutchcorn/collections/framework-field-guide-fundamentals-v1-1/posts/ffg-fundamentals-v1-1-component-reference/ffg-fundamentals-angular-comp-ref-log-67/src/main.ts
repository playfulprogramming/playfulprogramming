import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { AfterViewInit, Component, ViewChild } from "@angular/core";

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
		console.log("Hello, world");
	}
}

@Component({
	selector: "parent-comp",
	standalone: true,
	imports: [ChildComponent],
	template: `<child-comp #childVar />`,
})
class ParentComponent implements AfterViewInit {
	@ViewChild("childVar") childComp!: ChildComponent;

	ngAfterViewInit() {
		console.log(this.childComp);
	}
}

bootstrapApplication(ParentComponent);
