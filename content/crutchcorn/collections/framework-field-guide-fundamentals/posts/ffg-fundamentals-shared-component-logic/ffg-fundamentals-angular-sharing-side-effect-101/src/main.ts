import { bootstrapApplication } from "@angular/platform-browser";

import {
	Injectable,
	Component,
	inject,
	signal,
	effect,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Injectable()
class WindowSize {
	height = signal(0);
	width = signal(0);

	constructor() {
		effect((onCleanup) => {
			this.height.set(window.innerHeight);
			this.width.set(window.innerWidth);
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

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<p>
			The window is {{ windowSize.height() }}px high and
			{{ windowSize.width() }}px wide
		</p>
	`,
	providers: [WindowSize],
})
class AppComponent {
	windowSize = inject(WindowSize);
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
