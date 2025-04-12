import { bootstrapApplication } from "@angular/platform-browser";

import {
	signal,
	Component,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

const useWindowSize = () => {
	const height = signal(window.innerHeight);
	const width = signal(window.innerWidth);

	return { height, width };
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
	windowSize = useWindowSize();
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
