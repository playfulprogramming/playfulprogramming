import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, signal } from "@angular/core";

@Component({
	selector: "child-comp",
	template: "<p>I am the child</p>",
})
class ChildComponent {}

@Component({
	selector: "parent-comp",
	imports: [ChildComponent],
	template: `
		<div>
			<button (click)="setShowChild()">Toggle Child</button>
			@if (showChild()) {
				<child-comp />
			}
		</div>
	`,
})
class ParentComponent {
	showChild = signal(true);
	setShowChild() {
		this.showChild.set(!this.showChild());
	}
}

bootstrapApplication(ParentComponent);
