import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "window-size",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<p>Height: {{ height }}</p>
			<p>Width: {{ width }}</p>
		</div>
	`,
})
class WindowSizeComponent {
	height = window.innerHeight;
	width = window.innerWidth;
}

bootstrapApplication(WindowSizeComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
