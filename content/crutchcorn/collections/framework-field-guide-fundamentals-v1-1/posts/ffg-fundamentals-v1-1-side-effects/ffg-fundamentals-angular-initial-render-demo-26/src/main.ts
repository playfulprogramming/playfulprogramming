import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";

@Component({
	selector: "child-comp",
	standalone: true,
	template: "<p>I am the child</p>",
})
class ChildComponent {}

@Component({
	selector: "parent-comp",
	standalone: true,
	imports: [ChildComponent],
	template: `
		<div>
			<button (click)="setShowChild()">Toggle Child</button>
			@if (showChild) {
				<child-comp />
			}
		</div>
	`,
})
class ParentComponent {
	showChild = true;
	setShowChild() {
		this.showChild = !this.showChild;
	}
}

bootstrapApplication(ParentComponent);
