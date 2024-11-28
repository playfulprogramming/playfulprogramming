import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ContentChildren,
	QueryList,
	TemplateRef,
} from "@angular/core";

@Component({
	selector: "parent-list",
	standalone: true,
	template: `
		<p>There are {{ children.length }} number of items in this array</p>
		<ul>
			@for (template of children; track template; let i = $index) {
				<ng-template
					[ngTemplateOutlet]="template"
					[ngTemplateOutletContext]="{ backgroundColor: i % 2 ? 'grey' : '' }"
				></ng-template>
			}
		</ul>
	`,
})
class ParentListComponent {
	@ContentChildren("listItem", { read: TemplateRef }) children: QueryList<
		TemplateRef<any>
	>;
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ParentListComponent],
	template: `
		<parent-list>
			@for (item of list; track item; let i = $index) {
				<ng-template #listItem let-backgroundColor="backgroundColor">
					<li [style]="{ backgroundColor }">{{ i }} {{ item }}</li>
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
