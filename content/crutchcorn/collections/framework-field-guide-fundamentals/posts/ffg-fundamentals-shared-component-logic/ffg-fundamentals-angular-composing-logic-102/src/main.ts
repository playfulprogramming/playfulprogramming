import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	signal,
	effect,
	computed,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

const useWindowSize = () => {
	const height = signal(0);
	const width = signal(0);

	const onResize = () => {
		height.set(window.innerHeight);
		width.set(window.innerWidth);
	};

	effect((onCleanup) => {
		onResize();
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

const useIsMobile = () => {
	const windowSize = useWindowSize();
	const isMobile = computed(() => this.windowSize.width() <= 480);
	return { isMobile };
};

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <p>Is mobile? {{ isMobile.isMobile() }}</p> `,
})
class AppComponent {
	isMobile = useIsMobile();
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
