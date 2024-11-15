import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	provideExperimentalZonelessChangeDetection,
	signal,
	output,
	input,
} from "@angular/core";

@Component({
	selector: "expandable-dropdown",
	template: `
		<div>
			<button (click)="toggle.emit()">
				{{ expanded() ? "V" : ">" }}
				{{ name() }}
			</button>
			<div [hidden]="!expanded()">More information here</div>
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
	template: `
		<div>
			<h1>My Files</h1>
			<expandable-dropdown
				name="Movies"
				[expanded]="moviesExpanded()"
				(toggle)="moviesExpanded.set(!moviesExpanded())"
			/>
			<expandable-dropdown
				name="Pictures"
				[expanded]="picturesExpanded()"
				(toggle)="picturesExpanded.set(!picturesExpanded())"
			/>
			<expandable-dropdown
				name="Concepts"
				[expanded]="conceptsExpanded()"
				(toggle)="conceptsExpanded.set(!conceptsExpanded())"
			/>
			<expandable-dropdown
				name="Articles I'll Never Finish"
				[expanded]="articlesExpanded()"
				(toggle)="articlesExpanded.set(!articlesExpanded())"
			/>
			<expandable-dropdown
				name="Website Redesigns v5"
				[expanded]="redesignExpanded()"
				(toggle)="redesignExpanded.set(!redesignExpanded())"
			/>
			<expandable-dropdown
				name="Invoices"
				[expanded]="invoicesExpanded()"
				(toggle)="invoicesExpanded.set(!invoicesExpanded())"
			/>
		</div>
	`,
})
class SidebarComponent {
	moviesExpanded = signal(true);
	picturesExpanded = signal(false);
	conceptsExpanded = signal(false);
	articlesExpanded = signal(false);
	redesignExpanded = signal(false);
	invoicesExpanded = signal(false);
}

bootstrapApplication(SidebarComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
