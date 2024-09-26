import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, OnInit } from "@angular/core";

@Component({
	selector: "child-comp",
	standalone: true,
	template: "<p>I am the child</p>",
})
class ChildComponent implements OnInit {
	ngOnInit() {
		console.log("I am rendering");
	}
}

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
