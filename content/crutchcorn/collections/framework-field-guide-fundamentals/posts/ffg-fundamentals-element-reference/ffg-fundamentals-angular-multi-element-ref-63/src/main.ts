import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ElementRef,
	viewChildren,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "app-root",
	imports: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<button (click)="scrollToTop()">Scroll to top</button>
			<ul style="height: 100px; overflow: scroll">
				@for (message of messages; track message) {
					<li #listItem>
						{{ message }}
					</li>
				}
			</ul>
			<button (click)="scrollToBottom()">Scroll to bottom</button>
		</div>
	`,
})
class AppComponent {
	els = viewChildren("listItem", { read: ElementRef<HTMLElement> });

	scrollToTop() {
		this.els()[0]!.nativeElement.scrollIntoView();
	}

	scrollToBottom() {
		this.els()[this.els().length - 1]!.nativeElement.scrollIntoView();
	}

	messages = [
		"The new slides for the design keynote look wonderful!",
		"Some great new colours are planned to debut with Material Next!",
		"Hey everyone! Please take a look at the resources I’ve attached.",
		"So on Friday we were thinking about going through that park you’ve recommended.",
		"We will discuss our upcoming Pixel 6 strategy in the following week.",
		"On Thursday we drew some great new ideas for our talk.",
		"So the design teams got together and decided everything should be made of sand.",
	];
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
