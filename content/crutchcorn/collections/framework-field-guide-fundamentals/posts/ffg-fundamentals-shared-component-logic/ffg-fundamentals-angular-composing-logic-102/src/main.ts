import { bootstrapApplication } from "@angular/platform-browser";

import {
	Injectable,
	Component,
	inject,
	signal,
	effect,
	computed,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Injectable()
class WindowSize {
	height = signal(0);
	width = signal(0);

	constructor() {
		effect((onCleanup) => {
			this.onResize();
			window.addEventListener("resize", this.onResize);
			onCleanup(() => {
				window.removeEventListener("resize", this.onResize);
			});
		});
	}

	onResize = () => {
		this.height.set(window.innerHeight);
		this.width.set(window.innerWidth);
	};
}

@Injectable()
class IsMobile {
	windowSize = inject(WindowSize);
	isMobile = computed(() => this.windowSize.width() <= 480);
}

@Component({
	selector: "app-root",
	template: ` <p>Is mobile? {{ isMobile.isMobile() }}</p> `,
	providers: [WindowSize, IsMobile],
})
class AppComponent {
	isMobile = inject(IsMobile);
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
