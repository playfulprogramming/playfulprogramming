import { bootstrapApplication } from "@angular/platform-browser";
import {
	ChangeDetectionStrategy,
	Component,
	provideZonelessChangeDetection,
} from "@angular/core";
import { css } from "../styled-system/css";

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <div [class]="redBg"></div> `,
})
export class App {
	redBg = css({ bg: "red.400", height: "screen", width: "screen" });
}

void bootstrapApplication(App, {
	providers: [provideZonelessChangeDetection()],
});
