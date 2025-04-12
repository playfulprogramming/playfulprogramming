import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	effect,
	signal,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "cleanup-comp",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <p>Unmount me to see an alert</p> `,
})
class CleanupComponent {
	constructor() {
		effect((onCleanup) => {
			onCleanup(() => {
				alert("I am cleaning up");
			});
		});
	}
}

@Component({
	selector: "app-root",
	imports: [CleanupComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<button (click)="toggle()">Toggle</button>
			@if (show()) {
				<cleanup-comp />
			}
		</div>
	`,
})
class AppComponent {
	show = signal(true);

	toggle() {
		this.show.set(!this.show());
	}
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
