import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";

@Component({
	selector: "window-size",
	template: `
		<!-- This code doesn't work, we'll explain why soon -->
		<div (resize)="resizeHandler()">
			<p>Height: {{ height }}</p>
			<p>Width: {{ width }}</p>
		</div>
	`,
})
class WindowSizeComponent {
	height = window.innerHeight;
	width = window.innerWidth;

	resizeHandler() {
		this.height = window.innerHeight;
		this.width = window.innerWidth;
	}
}

bootstrapApplication(WindowSizeComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
