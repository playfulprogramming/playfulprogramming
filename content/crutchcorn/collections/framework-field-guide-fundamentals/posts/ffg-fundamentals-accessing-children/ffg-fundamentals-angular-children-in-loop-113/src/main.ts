import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	contentChildren,
	TemplateRef,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
	selector: "parent-list",
	imports: [NgTemplateOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
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
	changeDetection: ChangeDetectionStrategy.OnPush,
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

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
