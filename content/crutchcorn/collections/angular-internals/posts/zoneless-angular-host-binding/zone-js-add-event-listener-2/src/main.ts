import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { AfterViewInit, Component, ElementRef, viewChild } from "@angular/core";

@Component({
	selector: "app-root",
	// Must not be `OnPush` to demonstrate this behavior working
	template: `<button #el>{{ count }}</button>`,
})
export class AppComponent implements AfterViewInit {
	count = 0;

	el = viewChild.required<ElementRef>("el");

	ngAfterViewInit() {
		// Can't be OnPush is because we're not properly marking this component
		// as a dirty one for checking, so OnPush bypasses checking this node.
		this.el()!.nativeElement.addEventListener("click", this.add.bind(this));
	}

	add() {
		this.count++;
	}
}

bootstrapApplication(AppComponent);
