import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	effect,
	signal,
	ViewEncapsulation,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "dark-mode-toggle",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div style="display: flex; gap: 1rem">
			<label style="display: inline-flex; flex-direction: column">
				<div>Light</div>
				<input
					name="theme"
					type="radio"
					[checked]="explicitTheme() === 'light'"
					(change)="explicitTheme.set('light')"
				/>
			</label>
			<label style="display: inline-flex; flex-direction: column">
				<div>Inherit</div>
				<input
					name="theme"
					type="radio"
					[checked]="explicitTheme() === 'inherit'"
					(change)="explicitTheme.set('inherit')"
				/>
			</label>
			<label style="display: inline-flex; flex-direction: column">
				<div>Dark</div>
				<input
					name="theme"
					type="radio"
					[checked]="explicitTheme() === 'dark'"
					(change)="explicitTheme.set('dark')"
				/>
			</label>
		</div>
	`,
})
class DarkModeToggleComponent {
	explicitTheme = signal(localStorage.getItem("theme") || "inherit");

	isOSDark = window.matchMedia("(prefers-color-scheme: dark)");

	// Remember, this has to be an arrow function, not a method
	changeOSTheme = () => {
		this.explicitTheme.set(this.isOSDark.matches ? "dark" : "light");
	};

	constructor() {
		effect(() => {
			localStorage.setItem("theme", this.explicitTheme());
		});

		effect(() => {
			if (this.explicitTheme() === "implicit") {
				document.documentElement.className = this.explicitTheme();
				return;
			}

			document.documentElement.className = this.explicitTheme();
		});

		effect((onCleanup) => {
			this.isOSDark.addEventListener("change", this.changeOSTheme);
			onCleanup(() => {
				this.isOSDark.removeEventListener("change", this.changeOSTheme);
			});
		});
	}
}

@Component({
	selector: "app-root",
	imports: [DarkModeToggleComponent],
	// This allows our CSS to be global
	encapsulation: ViewEncapsulation.None,
	styles: [
		`
			:root {
				--primary: #1a42e5;
			}

			.dark {
				background: #121926;
				color: #d6e4ff;
				--primary: #6694ff;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<dark-mode-toggle />
			<p style="color: var(--primary)">This text is blue</p>
		</div>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
