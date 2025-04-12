import { bootstrapApplication } from "@angular/platform-browser";

import {
	afterRenderEffect,
	Component,
	viewChild,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "child-comp",
	changeDetection: ChangeDetectionStrategy.OnPush,
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
	imports: [ChildComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<child-comp #childVar />`,
})
class ParentComponent {
	childComp = viewChild.required("childVar", { read: ChildComponent });

	constructor() {
		afterRenderEffect(() => {
			console.log(this.childComp());
		});
	}
}

bootstrapApplication(ParentComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
