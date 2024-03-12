import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
	selector: "dark-mode-toggle",
	standalone: true,
	template: `
		<div style="display: flex; gap: 1rem">
			<label style="display: inline-flex; flex-direction: column">
				<div>Light</div>
				<input
					name="theme"
					type="radio"
					[checked]="explicitTheme === 'light'"
					(change)="setExplicitTheme('light')"
				/>
			</label>
			<label style="display: inline-flex; flex-direction: column">
				<div>Inherit</div>
				<input
					name="theme"
					type="radio"
					[checked]="explicitTheme === 'inherit'"
					(change)="setExplicitTheme('inherit')"
				/>
			</label>
			<label style="display: inline-flex; flex-direction: column">
				<div>Dark</div>
				<input
					name="theme"
					type="radio"
					[checked]="explicitTheme === 'dark'"
					(change)="setExplicitTheme('dark')"
				/>
			</label>
		</div>
	`,
})
class DarkModeToggleComponent implements OnInit, OnDestroy {
	explicitTheme = localStorage.getItem("theme") || "inherit";

	isOSDark = window.matchMedia("(prefers-color-scheme: dark)");

	osTheme = this.isOSDark.matches ? "dark" : "light";

	// Remember, this has to be an arrow function, not a method
	changeOSTheme = () => {
		this.setExplicitTheme(this.isOSDark.matches ? "dark" : "light");
	};

	ngOnInit() {
		this.isOSDark.addEventListener("change", this.changeOSTheme);
	}

	ngOnDestroy() {
		this.isOSDark.removeEventListener("change", this.changeOSTheme);
	}

	setExplicitTheme(val: string) {
		this.explicitTheme = val;

		localStorage.setItem("theme", val);

		if (val === "implicit") {
			document.documentElement.className = val;
			return;
		}

		document.documentElement.className = val;
	}
}

@Component({
	selector: "app-root",
	standalone: true,
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
	template: `
		<div>
			<dark-mode-toggle />
			<p style="color: var(--primary)">This text is blue</p>
		</div>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
