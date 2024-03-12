import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "dropdown-comp",
	standalone: true,
	template: `
		<button
			(click)="toggle.emit()"
			:aria-expanded="expanded"
			aria-controls="dropdown-contents"
		>
			{{ expanded ? "V" : ">" }} <ng-content select="[header]" />
		</button>
		<div id="dropdown-contents" role="region" [hidden]="!expanded">
			<ng-content />
		</div>
	`,
})
class DropdownComponent {
	@Input() expanded!: boolean;
	@Output() toggle = new EventEmitter();
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [DropdownComponent],
	template: `
		<dropdown-comp [expanded]="expanded" (toggle)="expanded = !expanded">
			<ng-container header>Let's build this dropdown component</ng-container>
			These tend to be useful for FAQ pages, hidden contents, and more!
		</dropdown-comp>
	`,
})
class AppComponent {
	expanded = false;
}

bootstrapApplication(AppComponent);
