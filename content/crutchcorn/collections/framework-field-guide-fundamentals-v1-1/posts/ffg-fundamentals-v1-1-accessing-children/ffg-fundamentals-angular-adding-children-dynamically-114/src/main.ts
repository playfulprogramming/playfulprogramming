import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ContentChildren,
	QueryList,
	TemplateRef,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
	selector: "parent-list",
	standalone: true,
	imports: [NgTemplateOutlet],
	template: `
		<p>There are {{ children.length }} number of items in this array</p>
		<ul>
			@for (child of children; track child) {
				<li>
					<ng-template [ngTemplateOutlet]="child" />
				</li>
			}
		</ul>
	`,
})
class ParentListComponent {
	@ContentChildren("listItem") children!: QueryList<TemplateRef<any>>;
}

@Component({
	standalone: true,
	imports: [ParentListComponent],
	selector: "app-root",
	template: `
		<parent-list>
			@for (item of list; track item; let i = $index) {
				<ng-template #listItem>
					<span>{{ i }} {{ item }}</span>
				</ng-template>
			}
		</parent-list>
		<button (click)="addOne()">Add</button>
	`,
})
class AppComponent {
	list = [1, 42, 13];

	addOne() {
		const randomNum = Math.floor(Math.random() * 100);
		this.list.push(randomNum);
	}
}

bootstrapApplication(AppComponent);
