import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	signal,
	output,
	input,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "expandable-dropdown",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<button (click)="toggle.emit()">
				{{ expanded() ? "V" : ">" }}
				{{ name() }}
			</button>
			@if (expanded()) {
				<div>More information here</div>
			}
		</div>
	`,
})
class ExpandableDropdownComponent {
	name = input.required<string>();
	expanded = input.required<boolean>();
	toggle = output();
}

@Component({
	selector: "app-sidebar",
	imports: [ExpandableDropdownComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<h1>My Files</h1>
			@for (cat of categories; track cat) {
				<expandable-dropdown
					[name]="cat"
					[expanded]="expandedMap()[cat]"
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

	expandedMap = signal(objFromCategories(this.categories));

	onToggle(cat: string) {
		const newExtendedMap = this.expandedMap();
		newExtendedMap[cat] = !newExtendedMap[cat];
		this.expandedMap.set(newExtendedMap);
	}
}

function objFromCategories(categories: string[]) {
	const obj: Record<string, boolean> = {};
	for (const cat of categories) {
		obj[cat] = false;
	}
	return obj;
}

bootstrapApplication(SidebarComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
