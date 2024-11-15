import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	effect,
	input,
	OnDestroy,
	OnInit,
	output,
	signal,
	viewChild,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "app-layout",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div style="display: flex; flex-wrap: nowrap; min-height: 100vh">
			<div
				[style]="
					'width: ' +
					sidebarWidth +
					'px;' +
					'height: 100vh;' +
					'overflow-y: scroll;' +
					'border-right: 2px solid #bfbfbf;'
				"
			>
				<ng-content select="[sidebar]" />
			</div>
			<div style="width: 1px; flex-grow: 1">
				<ng-content />
			</div>
		</div>
	`,
})
class LayoutComponent {
	sidebarWidth = input.required<number>();
}

@Component({
	selector: "app-sidebar",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (isCollapsed()) {
			<button (click)="toggleCollapsed()">Toggle</button>
		}
		@if (!isCollapsed()) {
			<div>
				<button (click)="toggleCollapsed()">Toggle</button>
				<ul style="padding: 1rem">
					<li>List item 1</li>
					<li>List item 2</li>
					<li>List item 3</li>
					<li>List item 4</li>
					<li>List item 5</li>
					<li>List item 6</li>
				</ul>
			</div>
		}
	`,
})
class SidebarComponent {
	toggle = output<boolean>();

	isCollapsed = signal(false);

	setAndToggle(v: boolean) {
		this.isCollapsed.set(v);
		this.toggle.emit(v);
	}

	collapse() {
		this.setAndToggle(true);
	}

	expand() {
		this.setAndToggle(false);
	}

	toggleCollapsed() {
		this.setAndToggle(!this.isCollapsed);
	}
}

@Component({
	selector: "app-root",
	imports: [LayoutComponent, SidebarComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<app-layout [sidebarWidth]="width()">
			<app-sidebar #sidebar sidebar (toggle)="onToggle($event)" />
			<p style="padding: 1rem">Hi there!</p>
		</app-layout>
	`,
})
class AppComponent {
	sidebar = viewChild.required("sidebar", { read: SidebarComponent });

	collapsedWidth = 100;
	expandedWidth = 150;
	widthToCollapseAt = 600;

	width = signal(this.expandedWidth);

	onToggle(isCollapsed: boolean) {
		if (isCollapsed) {
			this.width.set(this.collapsedWidth);
			return;
		}
		this.width.set(this.expandedWidth);
	}

	onResize = () => {
		if (window.innerWidth < this.widthToCollapseAt) {
			this.sidebar().collapse();
		} else if (this.sidebar().isCollapsed()) {
			this.sidebar().expand();
		}
	};

	constructor() {
		effect((onCleanup) => {
			window.addEventListener("resize", this.onResize);

			onCleanup(() => {
				window.removeEventListener("resize", this.onResize);
			});
		});
	}
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
