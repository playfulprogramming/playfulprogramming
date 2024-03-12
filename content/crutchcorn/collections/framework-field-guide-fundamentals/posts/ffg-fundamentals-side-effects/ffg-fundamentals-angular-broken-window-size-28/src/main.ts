import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";

@Component({
	selector: "window-size",
	standalone: true,
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

bootstrapApplication(WindowSizeComponent);
