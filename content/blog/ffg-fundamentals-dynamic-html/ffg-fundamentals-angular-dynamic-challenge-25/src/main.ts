import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Input, EventEmitter, Output } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";

@Component({
	selector: "expandable-dropdown",
	standalone: true,
	imports: [NgIf],
	template: `
		<div>
			<button (click)="toggle.emit()">
				{{ expanded ? "V" : ">" }}
				{{ name }}
			</button>
			<div *ngIf="expanded">More information here</div>
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
	imports: [ExpandableDropdownComponent, NgFor],
	template: `
		<div>
			<h1>My Files</h1>
			<expandable-dropdown
				*ngFor="let cat of categories"
				[name]="cat"
				[expanded]="expandedMap[cat]"
				(toggle)="onToggle(cat)"
			/>
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
