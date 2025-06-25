import { bootstrapApplication } from "@angular/platform-browser";
import {
	ChangeDetectionStrategy,
	Component,
	provideZonelessChangeDetection,
	ViewEncapsulation,
} from "@angular/core";
import { SearchIcon } from "./search-icon";

@Component({
	selector: "search-box",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [SearchIcon],
	styles: [
		`
			.container {
				border-radius: 8px;
				color: #3366ff;
				background: rgba(102, 148, 255, 0.1);
				padding: 8px;
				display: flex;
			}
		`,
	],
	encapsulation: ViewEncapsulation.None,
	template: `
		<div class="container">
			<search-icon />
		</div>
	`,
})
export class SearchBox {}

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [SearchBox],
	template: ` <search-box /> `,
})
export class App {}

void bootstrapApplication(App, {
	providers: [provideZonelessChangeDetection()],
});
