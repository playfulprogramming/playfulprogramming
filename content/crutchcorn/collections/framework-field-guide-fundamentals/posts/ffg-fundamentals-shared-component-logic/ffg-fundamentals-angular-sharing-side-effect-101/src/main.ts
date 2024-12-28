import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	signal,
	effect,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

const useWindow = () => {
	const height = signal(0);
	const width = signal(0);

	const onResize = () => {
		height.set(window.innerHeight);
		width.set(window.innerWidth);
	};

	effect((onCleanup) => {
		height.set(window.innerHeight);
		width.set(window.innerWidth);
		window.addEventListener("resize", onResize);
		onCleanup(() => {
			window.removeEventListener("resize", onResize);
		});
	});

	return {
		height,
		width,
	};
};

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<p>
			The window is {{ windowSize.height() }}px high and
			{{ windowSize.width() }}px wide
		</p>
	`,
})
class AppComponent {
	windowSize = useWindow();
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
