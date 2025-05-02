import { bootstrapApplication } from "@angular/platform-browser";

import {
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
		alert("Hello, world");
	}
}

@Component({
	selector: "parent-comp",
	imports: [ChildComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button (click)="sayHiFromChild()">Say hi</button>
		<child-comp #childVar />
	`,
})
class ParentComponent {
	childComp = viewChild.required("childVar", { read: ChildComponent });

	sayHiFromChild() {
		this.childComp().sayHi();
	}
}

bootstrapApplication(ParentComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
