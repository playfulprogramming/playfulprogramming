import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Input, EventEmitter, Output } from "@angular/core";

@Component({
	selector: "expandable-dropdown",
	standalone: true,
	template: `
		<div>
			<button (click)="toggle.emit()">
				{{ expanded ? "V" : ">" }}
				{{ name }}
			</button>
			@if (expanded) {
				<div>More information here</div>
			}
		</div>
	`,
})
class ExpandableDropdownComponent {
	@Input() name!: string;
	@Input() expanded!: boolean;
	@Output() toggle = new EventEmitter();
}

@Component({
	selector: "app-sidebar",
	standalone: true,
	imports: [ExpandableDropdownComponent],
	template: `
		<div>
			<h1>My Files</h1>
			@for (cat of categories; track cat) {
				<expandable-dropdown
					[name]="cat"
					[expanded]="expandedMap[cat]"
					(toggle)="onToggle(cat)"
				/>
			}
		</div>
	`,
})
class SidebarComponent {
	categories = [
		"Movies",
		"Pictures",
		"Concepts",
		"Articles I'll Never Finish",
		"Website Redesigns v5",
		"Invoices",
	];

	expandedMap = objFromCategories(this.categories);

	onToggle(cat: string) {
		this.expandedMap[cat] = !this.expandedMap[cat];
	}
}

function objFromCategories(categories: string[]) {
	const obj: Record<string, boolean> = {};
	for (const cat of categories) {
		obj[cat] = false;
	}
	return obj;
}

bootstrapApplication(SidebarComponent);
