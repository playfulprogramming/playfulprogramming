import { bootstrapApplication } from "@angular/platform-browser";
import {
	ChangeDetectionStrategy,
	Component,
	input,
	provideZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "app-card",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="card">
			<h2 data-title>{{ title() }}</h2>
			<p>{{ description() }}</p>
		</div>
	`,
	styles: [
		`
			.card {
				border: 1px solid #ddd;
				border-radius: 4px;
				padding: 16px;
				margin: 16px;
			}
		`,
	],
})
export class Card {
	title = input.required<string>();
	description = input.required<string>();
}

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [Card],
	template: `
		<ul>
			<li class="red-card">
				<app-card title="Red Card" description="Description 1" />
			</li>
			<li class="blue-card">
				<app-card title="Blue Card" description="Description 2" />
			</li>
			<li class="green-card">
				<app-card title="Green Card" description="Description 3" />
			</li>
		</ul>
	`,
	styles: [
		`
			ul {
				display: flex;
				list-style: none;
			}

			.red-card ::ng-deep [data-title] {
				color: red;
			}

			.blue-card ::ng-deep [data-title] {
				color: blue;
			}

			.green-card ::ng-deep [data-title] {
				color: green;
			}
		`,
	],
})
export class App {}

void bootstrapApplication(App, {
	providers: [provideZonelessChangeDetection()],
});
