import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, effect, signal } from "@angular/core";

@Component({
	selector: "window-size",
	template: `
		<div>
			<p>Height: {{ height() }}</p>
			<p>Width: {{ width() }}</p>
		</div>
	`,
})
class WindowSizeComponent {
	height = signal(window.innerHeight);
	width = signal(window.innerWidth);

	resizeHandler = () => {
		this.height.set(window.innerHeight);
		this.width.set(window.innerWidth);
	};

	constructor() {
		// This code will cause a memory leak, more on that soon
		effect(() => {
			window.addEventListener("resize", this.resizeHandler);
		});
	}
}

bootstrapApplication(WindowSizeComponent);
