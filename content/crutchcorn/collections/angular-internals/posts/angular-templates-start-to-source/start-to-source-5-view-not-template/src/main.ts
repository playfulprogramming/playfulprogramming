import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";

@Component({
	selector: "my-custom-component",
	template: `
		<p>Check the console to see the inputs' values from the parent component</p>
	`,
})
export class MyComponentComponent {
	@Input() inputHere!: number;
}

@Component({
	selector: "my-app",
	imports: [MyComponentComponent],
	template: `
		<my-custom-component
			#myComponent
			[inputHere]="50"
			data-unrelatedAttr="Hi there!"
		></my-custom-component>
	`,
})
export class AppComponent implements AfterViewInit {
	@ViewChild("myComponent", { static: false })
	myComponent!: MyComponentComponent;

	ngAfterViewInit() {
		console.log(this.myComponent.inputHere); // This will print `50`
	}
}

bootstrapApplication(AppComponent);
