import { bootstrapApplication } from "@angular/platform-browser";
import {
	ChangeDetectionStrategy,
	Component,
	provideZonelessChangeDetection,
} from "@angular/core";
import { css } from "@emotion/css";

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <h1 [class]="styles">I am a heading</h1> `,
})
export class App {
	headerColor = "#2A3751";

	styles = css`
		color: ${this.headerColor};
		font-size: 2rem;
		text-decoration: underline;
	`;
}

void bootstrapApplication(App, {
	providers: [provideZonelessChangeDetection()],
});
