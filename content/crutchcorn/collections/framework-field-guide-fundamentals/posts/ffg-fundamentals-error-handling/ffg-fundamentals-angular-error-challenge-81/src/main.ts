import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ErrorHandler,
	EventEmitter,
	inject,
	Input,
	OnDestroy,
	OnInit,
	Output,
	Pipe,
	PipeTransform,
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
		<!-- "isCollapsed" is a boolean! -->
		<!-- It's supposed to be "toggleCollapsed"! 😱 -->
		@if (isCollapsed) {
			<button (click)="isCollapsed()">Toggle</button>
		}
		@if (!isCollapsed) {
			<div>
				<button (click)="isCollapsed()">Toggle</button>
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

	// Notice the type cast to `any`
	isCollapsed: any = false;

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

class MyErrorHandler implements ErrorHandler {
	error: any = null;

	handleError(error: unknown) {
		console.log(error);
		this.error = error;
	}
}

@Pipe({ name: "errorHref", standalone: true })
class ErrorHrefPipe implements PipeTransform {
	transform(err: Error | null): string {
		console.log({ err });
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
	}
}

@Component({
	selector: "error-catcher",
	standalone: true,
	imports: [ErrorHrefPipe],
	template: `
		@if (errorHandler.error) {
			<div>
				<h1>{{ errorHandler.error.name }}</h1>
				<pre
					style="white-space: pre-wrap"
				><code>{{ errorHandler.error.message }}</code></pre>
				<a [href]="errorHandler.error | errorHref"
					>Email us to report the bug</a
				>
				<br />
				<br />
				<details>
					<summary>Error stack</summary>
					<pre
						style="white-space: pre-wrap"
					><code>{{ errorHandler.error.stack }}</code></pre>
				</details>
			</div>
		}
		@if (!errorHandler.error) {
			<ng-content></ng-content>
		}
	`,
})
class ErrorCatcher {
	errorHandler = inject(ErrorHandler) as MyErrorHandler;
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [LayoutComponent, SidebarComponent, ErrorCatcher],
	template: `
		<error-catcher>
			<app-layout [sidebarWidth]="width">
				<app-sidebar #sidebar sidebar (toggle)="onToggle($event)" />
				<p style="padding: 1rem">Hi there!</p>
			</app-layout>
		</error-catcher>
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

bootstrapApplication(AppComponent, {
	providers: [{ provide: ErrorHandler, useClass: MyErrorHandler }],
});
