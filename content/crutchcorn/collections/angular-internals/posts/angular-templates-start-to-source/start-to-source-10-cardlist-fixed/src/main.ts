import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	AfterViewInit,
	Component,
	ContentChildren,
	ElementRef,
	QueryList,
	Renderer2,
} from "@angular/core";

@Component({
	selector: "action-card",
	template: ` <div>This is a card</div> `,
	styles: [
		`
			:host {
				border: 1px solid black;
				display: inline-block;
				height: 300px;
				width: 100px;
				background: grey;
				margin: 10px;
			}
		`,
	],
})
export class ActionCard {}

@Component({
	selector: "cards-list",
	template: ` <div><ng-content></ng-content></div> `,
	styles: [
		`
			:host {
				background: grey;
				display: block;
			}
		`,
	],
})
export class CardsList implements AfterViewInit {
	constructor(private renderer: Renderer2) {}
	@ContentChildren(ActionCard, { read: ElementRef })
	actionCards!: QueryList<ElementRef>;

	ngAfterViewInit() {
		// Any production code should absolutely be running `Renderer2` to do this rather than modifying the native element yourself
		this.actionCards.forEach((elRef) => {
			console.log("Changing background of a card");
			this.renderer.setStyle(elRef.nativeElement, "background", "white");
		});
	}
}

@Component({
	selector: "my-app",
	imports: [ActionCard, CardsList],
	template: `
		<cards-list>
			<!-- Cards list has default styling with grey background -->
			<action-card></action-card>
			<!-- Action card has default styling with grey background -->
			<action-card></action-card>
			<!-- It's also widely used across the app, so that can't change -->
		</cards-list>
	`,
})
export class AppComponent {}

bootstrapApplication(AppComponent);
