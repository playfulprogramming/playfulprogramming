import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

const useWindowSize = () => {
	const height = window.innerHeight;
	const width = window.innerWidth;

	return { height, width };
};

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<p>
			The window is {{ windowSize.height }}px high and {{ windowSize.width }}px
			wide
		</p>
	`,
})
class AppComponent {
	windowSize = useWindowSize();
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
