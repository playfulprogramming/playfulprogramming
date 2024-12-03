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
			<ng-template #listItem>
				<span style="color: red">Red</span>
			</ng-template>
			<ng-template #listItem>
				<span style="color: green">Green</span>
			</ng-template>
			<ng-template #listItem>
				<span style="color: blue">Blue</span>
			</ng-template>
		</parent-list>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
