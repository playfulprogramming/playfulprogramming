import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	signal,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<ul role="tablist">
				@for (tab of tabList; let index = $index; track tab.id) {
					<li
						role="tab"
						[attr.id]="tab.id"
						[attr.tabIndex]="index === activeTabIndex() ? 0 : -1"
						[attr.aria-selected]="index === activeTabIndex()"
						[attr.aria-controls]="tab.panelId"
						(click)="setActiveTabIndex(index)"
						(keydown)="onKeyDown($event)"
					>
						{{ tab.label }}
					</li>
				}
			</ul>
			@for (tab of tabList; let index = $index; track tab.panelId) {
				<div
					role="tabpanel"
					[attr.id]="tab.panelId"
					[attr.aria-labelledby]="tab.id"
					[style]="
						'display: ' + (index !== activeTabIndex() ? 'none' : 'block')
					"
				>
					<code>
						{{ tab.content }}
					</code>
				</div>
			}
		</div>
	`,
	styles: [
		`
			/* index.css */
			[role="tablist"] {
				margin: 0;
				padding: 0;
				display: flex;
				gap: 0.25rem;
			}

			[role="tab"] {
				display: inline-block;
				padding: 1rem;
				border: solid black;
				border-width: 2px 2px 0 2px;
				border-radius: 1rem 1rem 0 0;
			}

			[role="tab"]:focus-visible {
				outline: none;
				box-shadow:
					0 0 0 2px #000,
					0 0 0 4px #fff,
					0 0 0 6px #000;
			}

			[role="tab"]:hover {
				background: #d3d3d3;
			}

			[role="tab"]:active {
				background: #878787;
			}

			[role="tab"][aria-selected="true"] {
				background: black;
				color: white;
			}

			[role="tabpanel"] {
				border: solid black;
				border-width: 2px;
				padding: 1rem;
				border-radius: 0 1rem 1rem 1rem;
			}
		`,
	],
})
export class AppComponent {
	activeTabIndex = signal(0);

	setActiveTabIndex(val: number) {
		const normalizedIndex = normalizeCount(val, this.tabList.length);
		this.activeTabIndex.set(normalizedIndex);
		const target = document.getElementById(this.tabList[normalizedIndex].id);
		target?.focus();
	}

	onKeyDown(event: KeyboardEvent) {
		let preventDefault = false;

		switch (event.key) {
			case "ArrowLeft":
				this.setActiveTabIndex(this.activeTabIndex() - 1);
				preventDefault = true;
				break;

			case "ArrowRight":
				this.setActiveTabIndex(this.activeTabIndex() + 1);
				preventDefault = true;
				break;

			case "Home":
				this.setActiveTabIndex(0);
				preventDefault = true;
				break;

			case "End":
				this.setActiveTabIndex(this.tabList.length - 1);
				preventDefault = true;
				break;

			default:
				break;
		}

		if (preventDefault) {
			event.stopPropagation();
			event.preventDefault();
		}
	}

	tabList = [
		{
			id: "javascript-tab",
			label: "JavaScript",
			panelId: "javascript-panel",
			content: `console.log("Hello, world!");`,
		},
		{
			id: "python-tab",
			label: "Python",
			panelId: "python-panel",
			content: `print("Hello, world!")`,
		},
	];
}

function normalizeCount(index: number, max: number) {
	if (index < 0) {
		return max - 1;
	}

	if (index >= max) {
		return 0;
	}

	return index;
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
