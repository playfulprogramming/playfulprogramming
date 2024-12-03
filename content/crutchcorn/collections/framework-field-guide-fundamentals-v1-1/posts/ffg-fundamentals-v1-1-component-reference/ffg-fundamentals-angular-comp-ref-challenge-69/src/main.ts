import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
} from "@angular/core";

@Component({
	selector: "app-layout",
	standalone: true,
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
	@Input() sidebarWidth!: number;
}

@Component({
	selector: "app-sidebar",
	standalone: true,
	imports: [],
	template: `
		@if (isCollapsed) {
			<button (click)="toggleCollapsed()">Toggle</button>
		}
		@if (!isCollapsed) {
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
	@Output() toggle = new EventEmitter<boolean>();

	isCollapsed = false;

	setAndToggle(v: boolean) {
		this.isCollapsed = v;
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
	standalone: true,
	imports: [LayoutComponent, SidebarComponent],
	template: `
		<app-layout [sidebarWidth]="width">
			<app-sidebar #sidebar sidebar (toggle)="onToggle($event)" />
			<p style="padding: 1rem">Hi there!</p>
		</app-layout>
	`,
})
class AppComponent implements OnInit, OnDestroy {
	@ViewChild("sidebar", { static: true }) sidebar!: SidebarComponent;

	collapsedWidth = 100;
	expandedWidth = 150;
	widthToCollapseAt = 600;

	width = this.expandedWidth;

	onToggle(isCollapsed: boolean) {
		if (isCollapsed) {
			this.width = this.collapsedWidth;
			return;
		}
		this.width = this.expandedWidth;
	}

	onResize = () => {
		if (window.innerWidth < this.widthToCollapseAt) {
			this.sidebar.collapse();
		} else if (this.sidebar.isCollapsed) {
			this.sidebar.expand();
		}
	};

	ngOnInit() {
		window.addEventListener("resize", this.onResize);
	}

	ngOnDestroy() {
		window.removeEventListener("resize", this.onResize);
	}
}

bootstrapApplication(AppComponent);
