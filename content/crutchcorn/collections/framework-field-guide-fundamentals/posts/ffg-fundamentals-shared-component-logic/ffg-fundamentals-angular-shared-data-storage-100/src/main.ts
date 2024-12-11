import { bootstrapApplication } from "@angular/platform-browser";

import {
	Injectable,
	Component,
	inject,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Injectable()
class WindowSize {
	height = window.innerHeight;
	width = window.innerWidth;
}

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
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

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
