import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	AfterViewInit,
	Component,
	ElementRef,
	QueryList,
	Renderer2,
	ViewChildren,
} from "@angular/core";

@Component({
	selector: "action-card",
	standalone: true,
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
	standalone: true,
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
	@ViewChildren(ActionCard, { read: ElementRef })
	actionCards!: QueryList<ElementRef>;

	ngAfterViewInit() {
		// Any production code should absolutely be cleaning this up properly, this is just for demonstration purposes
		this.actionCards.forEach((elRef) => {
			console.log("Changing background of a card");
			this.renderer.setStyle(elRef.nativeElement, "background", "white");
		});
	}
}

@Component({
	selector: "my-app",
	standalone: true,
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
