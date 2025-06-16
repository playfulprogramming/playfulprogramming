import { bootstrapApplication } from "@angular/platform-browser";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import { css } from "../styled-system/css";

@Component({
	selector: "app-root",
	standalone: true,
	template: ` <div [class]="redBg"></div> `,
})
export class App {
	redBg = css({ bg: "red.400", height: "screen", width: "screen" });
}

void bootstrapApplication(App, {
	providers: [provideZonelessChangeDetection()],
});
