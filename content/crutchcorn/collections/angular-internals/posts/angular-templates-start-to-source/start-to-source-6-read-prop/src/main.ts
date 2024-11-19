import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	ViewChild,
} from "@angular/core";

@Component({
	selector: "my-custom-component",
	standalone: true,
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
	standalone: true,
	template: `
		<my-custom-component
			#myComponent
			[inputHere]="50"
			data-unrelatedAttr="Hi there!"
		></my-custom-component>
	`,
})
export class AppComponent implements AfterViewInit {
	@ViewChild("myComponent", { read: ElementRef, static: false })
	myComponent!: ElementRef;

	ngAfterViewInit() {
		console.log(
			this.myComponent.nativeElement.getAttribute("data-unrelatedAttr"),
		); // This output `"Hi there!"`
	}
}

bootstrapApplication(AppComponent);
