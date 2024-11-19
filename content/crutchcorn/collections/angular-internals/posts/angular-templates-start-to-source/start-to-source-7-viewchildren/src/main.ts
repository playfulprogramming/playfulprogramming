import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	AfterViewInit,
	Component,
	Input,
	QueryList,
	ViewChildren,
} from "@angular/core";

@Component({
	selector: "my-custom-component",
	template: ` <p>I am a my-custom-component!</p> `,
})
export class MyComponentComponent {
	@Input() inputHere!: number;
}

@Component({
	selector: "my-app",
	imports: [MyComponentComponent],
	template: `
		<div>
			<p>Check the console to see that values of the two components</p>
			<my-custom-component [inputHere]="50"></my-custom-component>
			<my-custom-component [inputHere]="80"></my-custom-component>
		</div>
	`,
})
export class AppComponent implements AfterViewInit {
	@ViewChildren(MyComponentComponent)
	myComponents!: QueryList<MyComponentComponent>;

	ngAfterViewInit() {
		console.log(this.myComponents.length); // This will output 2
	}
}

bootstrapApplication(AppComponent);
