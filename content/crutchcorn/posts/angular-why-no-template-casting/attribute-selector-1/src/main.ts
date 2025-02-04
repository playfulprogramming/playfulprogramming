import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	ChangeDetectionStrategy,
	Component,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: `a[our-button], button[our-button]`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<ng-content></ng-content>`,
	styles: [
		`
			:host {
				display: inline-block;
				padding: 0.5em 1em;
				background: #007bff;
				color: white;
				text-decoration: none;
				border-radius: 0.25em;
			}

			:host:hover {
				background: #0056b3;
			}

			:host:active {
				background: #004b9e;
			}

			:host:focus {
				outline: 2px solid #0056b3;
			}
		`,
	],
})
class OurButton {}

@Component({
	selector: "app-root",
	imports: [OurButton],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<a our-button href="oceanbit.dev"
			>This looks like a button, but is a link</a
		>
	`,
})
class App {}

bootstrapApplication(App, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
