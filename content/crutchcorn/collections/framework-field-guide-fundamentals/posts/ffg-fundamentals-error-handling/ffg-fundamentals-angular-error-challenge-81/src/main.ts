import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	computed,
	effect,
	ErrorHandler,
	inject,
	input,
	output,
	signal,
	viewChild,
} from "@angular/core";

@Component({
	selector: "app-layout",
	template: `
		<div style="display: flex; flex-wrap: nowrap; min-height: 100vh">
			<div
				[style]="
					'width: ' +
					sidebarWidth() +
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
	template: `
		<!-- "toggle" is an event emitter! -->
		<!-- It's supposed to be "toggleCollapsed"! 😱 -->
		@if (isCollapsed()) {
			<button (click)="toggle()">Toggle</button>
		}
		@if (!isCollapsed()) {
			<div>
				<button (click)="toggle()">Toggle</button>
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
	// Notice the type cast to `any`
	toggle: any = output<boolean>();

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

class MyErrorHandler implements ErrorHandler {
	error = signal<any>(null);

	handleError(error: unknown) {
		console.log(error);
		this.error.set(error);
	}
}

@Component({
	selector: "error-catcher",
	template: `
		@if (errorHandler.error()) {
			<div>
				<h1>{{ errorHandler.error().name }}</h1>
				<pre
					style="white-space: pre-wrap"
				><code>{{ errorHandler.error().message }}</code></pre>
				<a [href]="errorHref()">Email us to report the bug</a>
				<br />
				<br />
				<details>
					<summary>Error stack</summary>
					<pre
						style="white-space: pre-wrap"
					><code>{{ errorHandler.error().stack }}</code></pre>
				</details>
			</div>
		}
		@if (!errorHandler.error()) {
			<ng-content></ng-content>
		}
	`,
})
class ErrorCatcher {
	errorHandler = inject(ErrorHandler) as MyErrorHandler;

	errorHref = computed(() => {
		const err = this.errorHandler.error();
		if (!err) return "";
		const mailTo = "dev@example.com";
		const header = "Bug Found";
		const message = `
    There was a bug found of type: "${err.name}".

    The message was: "${err.message}".

    The stack trace is:

    """
    ${err.stack}
    """
    `.trim();

		const encodedMsg = encodeURIComponent(message);

		const encodedHeader = encodeURIComponent(header);

		const href = `mailto:${mailTo}&subject=${encodedHeader}&body=${encodedMsg}`;

		return href;
	});
}

@Component({
	selector: "app-root",
	imports: [LayoutComponent, SidebarComponent, ErrorCatcher],
	template: `
		<error-catcher>
			<app-layout [sidebarWidth]="width()">
				<app-sidebar #sidebar sidebar (toggle)="onToggle($event)" />
				<p style="padding: 1rem">Hi there!</p>
			</app-layout>
		</error-catcher>
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
	providers: [{ provide: ErrorHandler, useClass: MyErrorHandler }],
});
