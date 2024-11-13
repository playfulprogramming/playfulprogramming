import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, contentChildren, signal, TemplateRef } from "@angular/core";

@Component({
	selector: "parent-list",
	template: `
		<p>There are {{ children().length }} number of items in this array</p>
		<ul>
			@for (template of children(); track template; let i = $index) {
				<ng-template
					[ngTemplateOutlet]="template"
					[ngTemplateOutletContext]="{ backgroundColor: i % 2 ? 'grey' : '' }"
				></ng-template>
			}
		</ul>
	`,
})
class ParentListComponent {
	children = contentChildren("listItem", { read: TemplateRef });
}

@Component({
	selector: "app-root",
	imports: [ParentListComponent],
	template: `
		<parent-list>
			@for (item of list(); track item; let i = $index) {
				<ng-template #listItem let-backgroundColor="backgroundColor">
					<li [style]="{ backgroundColor }">{{ i }} {{ item }}</li>
				</ng-template>
			}
		</parent-list>
		<button (click)="addOne()">Add</button>
	`,
})
class AppComponent {
	list = signal([1, 42, 13]);

	addOne() {
		const randomNum = Math.floor(Math.random() * 100);
		this.list.set([this.list(), ...randomNum]);
	}
}

bootstrapApplication(AppComponent);
