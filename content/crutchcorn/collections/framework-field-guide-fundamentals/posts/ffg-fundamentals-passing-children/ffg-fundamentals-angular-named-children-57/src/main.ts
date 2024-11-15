import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	input,
	output,
	signal,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "dropdown-comp",
	template: `
		<button
			(click)="toggle.emit()"
			:aria-expanded="expanded"
			aria-controls="dropdown-contents"
		>
			{{ expanded() ? "V" : ">" }} <ng-content select="[header]" />
		</button>
		<div id="dropdown-contents" role="region" [hidden]="!expanded()">
			<ng-content />
		</div>
	`,
})
class DropdownComponent {
	expanded = input.required<boolean>();
	toggle = output();
}

@Component({
	selector: "app-root",
	imports: [DropdownComponent],
	template: `
		<dropdown-comp [expanded]="expanded()" (toggle)="expanded.set(!expanded())">
			<ng-container header>Let's build this dropdown component</ng-container>
			These tend to be useful for FAQ pages, hidden contents, and more!
		</dropdown-comp>
	`,
})
class AppComponent {
	expanded = signal(false);
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
