import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Injectable, Component, inject, OnDestroy } from "@angular/core";

@Injectable()
class WindowSize implements OnDestroy {
	height = 0;
	width = 0;

	constructor() {
		this.height = window.innerHeight;
		this.width = window.innerWidth;
		// In a component, we might add this in an `OnInit`, but `Injectable` classes only have `OnDestroy`
		window.addEventListener("resize", this.onResize);
	}
	onResize = () => {
		this.height = window.innerHeight;
		this.width = window.innerWidth;
	};
	ngOnDestroy() {
		window.removeEventListener("resize", this.onResize);
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	template: `
		<p>
			The window is {{ windowSize.height }}px high and {{ windowSize.width }}px
			wide
		</p>
	`,
	providers: [WindowSize],
})
class AppComponent {
	windowSize = inject(WindowSize);
}

bootstrapApplication(AppComponent);
