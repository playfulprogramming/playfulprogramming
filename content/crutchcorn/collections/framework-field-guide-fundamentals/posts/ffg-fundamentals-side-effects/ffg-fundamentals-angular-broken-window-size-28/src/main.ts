import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "window-size",
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
