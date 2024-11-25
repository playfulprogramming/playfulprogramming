import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ViewContainerRef,
	Input,
	TemplateRef,
	Directive,
	AfterViewInit,
} from "@angular/core";

import { AsyncPipe, NgIf } from "@angular/common";

import { of } from "rxjs";

@Directive({ selector: "[uniFor]", standalone: true })
export class UniForOf<T> implements AfterViewInit {
	@Input() uniForOf!: Array<T> | null;

	constructor(
		private viewContainer: ViewContainerRef,
		private template: TemplateRef<any>,
	) {}

	ngAfterViewInit() {
		if (!this.uniForOf) return;
		this.uniForOf.forEach((ofItem, i) => {
			this.viewContainer.createEmbeddedView(this.template, {
				isFirst: i === 0,
				$implicit: ofItem,
				uniForOf: this.uniForOf,
			});
		});
	}
}

@Component({
	selector: "my-app",
	imports: [UniForOf, NgIf, AsyncPipe],
	template: `
		<p
			*uniFor="
				let num of numbers | async as allNumbers;
				let firstItem = isFirst
			"
		>
			Number in a list of {{ allNumbers.length }} numbers: {{ num }}
			<ng-container *ngIf="firstItem"> it's the first number!</ng-container>
		</p>
	`,
})
export class AppComponent {
	// `import {of} from 'rxjs';`
	numbers = of([1, 2, 3, 4, 5]);
}

bootstrapApplication(AppComponent);
