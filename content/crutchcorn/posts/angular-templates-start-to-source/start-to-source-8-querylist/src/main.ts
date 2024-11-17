import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	AfterViewInit,
	Component,
	Input,
	QueryList,
	ViewChildren,
} from "@angular/core";
import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "my-custom-component",
	standalone: true,
	template: ` <p>My value is {{ numberProp }}</p> `,
})
export class MyComponentComponent {
	@Input() inputHere!: number;

	numberProp = Math.floor(Math.random() * 20);
}

@Component({
	selector: "my-app",
	standalone: true,
	imports: [MyComponentComponent, NgIf, FormsModule],
	template: `
		<p>The console should output the combination of all values below</p>
		<input type="checkbox" [(ngModel)]="bool" />
		<div *ngIf="bool">
			<my-custom-component></my-custom-component>
		</div>
		<my-custom-component></my-custom-component>
	`,
})
export class AppComponent implements AfterViewInit {
	@ViewChildren(MyComponentComponent)
	myComponents!: QueryList<MyComponentComponent>;

	bool = false;

	ngAfterViewInit() {
		this.myComponents.changes.subscribe(
			(compsQueryList: QueryList<MyComponentComponent>) => {
				const componentsNum = compsQueryList.reduce((prev, comp) => {
					return prev + comp.numberProp;
				}, 0);
				console.log(componentsNum); // This would output the combined number from all of the component's `numberProp` field. This would run any time Angular saw a difference in the values
			},
		);
	}
}

bootstrapApplication(AppComponent);
