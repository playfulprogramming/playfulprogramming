import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	contentChildren,
	signal,
	TemplateRef,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
	selector: "parent-list",
	imports: [NgTemplateOutlet],
	template: `
		<p>There are {{ children().length }} number of items in this array</p>
		<ul>
			@for (child of children(); track child) {
				<li>
					<ng-template [ngTemplateOutlet]="child" />
				</li>
			}
		</ul>
	`,
})
class ParentListComponent {
	children = contentChildren<TemplateRef<any>>("listItem");
}

@Component({
	imports: [ParentListComponent],
	selector: "app-root",
	template: `
		<parent-list>
			@for (item of list(); track item; let i = $index) {
				<ng-template #listItem>
					<span>{{ i }} {{ item }}</span>
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
		this.list.set([...this.list(), randomNum]);
	}
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
