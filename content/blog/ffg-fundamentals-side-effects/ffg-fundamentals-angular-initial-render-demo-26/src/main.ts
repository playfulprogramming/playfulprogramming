import "zone.js/dist/zone";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Input, EventEmitter, Output, OnInit } from "@angular/core";
import { NgIf } from "@angular/common";

@Component({
	selector: "child-comp",
	standalone: true,
	template: "<p>I am the child</p>",
})
export class ChildComponent {}

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
export class ParentComponent {
	showChild = true;
	setShowChild() {
		this.showChild = !this.showChild;
	}
}

bootstrapApplication(ParentComponent);
