import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, OnInit } from "@angular/core";
import { NgIf } from "@angular/common";

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
	imports: [ChildComponent, NgIf],
	template: `
		<div>
			<button (click)="setShowChild()">Toggle Child</button>
			<child-comp *ngIf="showChild" />
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
