import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Injectable, Component, inject, OnDestroy } from "@angular/core";

@Injectable()
class WindowSize implements OnDestroy {
	height = 0;
	width = 0;

	// We'll overwrite this behavior in another service
	_listener!: () => void | undefined;

	constructor() {
		this.onResize();
		window.addEventListener("resize", this.onResize);
	}

	onResize = () => {
		this.height = window.innerHeight;
		this.width = window.innerWidth;
		// We will call this "listener" function if it's present
		if (this._listener) {
			this._listener();
		}
	};

	ngOnDestroy() {
		window.removeEventListener("resize", this.onResize);
	}
}

@Injectable()
class IsMobile {
	isMobile = false;

	// We cannot use the `inject` function here, because we need to overwrite our `constructor` behavior
	// and it's an either-or decision to use `constructor` or the `inject` function
	constructor(private windowSize: WindowSize) {
		windowSize._listener = () => {
			if (windowSize.width <= 480) this.isMobile = true;
			else this.isMobile = false;
		};
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	template: ` <p>Is mobile? {{ isMobile.isMobile }}</p> `,
	providers: [WindowSize, IsMobile],
})
class AppComponent {
	isMobile = inject(IsMobile);
}

bootstrapApplication(AppComponent);
