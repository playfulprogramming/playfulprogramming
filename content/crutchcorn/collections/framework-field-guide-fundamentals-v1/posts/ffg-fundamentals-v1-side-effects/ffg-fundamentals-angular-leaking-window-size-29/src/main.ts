import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, OnInit } from "@angular/core";

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
class WindowSizeComponent implements OnInit {
	height = window.innerHeight;
	width = window.innerWidth;

	resizeHandler = () => {
		this.height = window.innerHeight;
		this.width = window.innerWidth;
	};

	ngOnInit() {
		// This code will cause a memory leak, more on that soon
		window.addEventListener("resize", this.resizeHandler);
	}
}

bootstrapApplication(WindowSizeComponent);
