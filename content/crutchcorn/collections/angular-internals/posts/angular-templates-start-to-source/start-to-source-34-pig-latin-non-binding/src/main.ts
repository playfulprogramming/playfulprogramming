import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ViewContainerRef,
	OnInit,
	Input,
	TemplateRef,
	Directive,
} from "@angular/core";

@Directive({
	selector: "[makePiglatin]",
})
export class MakePigLatinDirective implements OnInit {
	constructor(
		private templ: TemplateRef<any>,
		private parentViewRef: ViewContainerRef,
	) {}

	@Input() makePiglatin!: string;
	@Input() makePiglatinCasing!: "UPPER" | "lower";

	ngOnInit() {
		let pigLatinVal = translatePigLatin(this.makePiglatin);
		if (this.makePiglatinCasing === "UPPER") {
			pigLatinVal = pigLatinVal.toUpperCase();
		} else if (this.makePiglatinCasing === "lower") {
			pigLatinVal = pigLatinVal.toLowerCase();
		}
		this.parentViewRef.createEmbeddedView(this.templ, {
			$implicit: pigLatinVal,
			original: this.makePiglatin,
		});
	}
}

@Component({
	selector: "my-app",
	imports: [MakePigLatinDirective],
	template: `
		<p
			*makePiglatin="'This is a string'; let msg; let ogMsg = original"
			[makePiglatinCasing]="'UPPER'"
		>
			The message "{{ msg }}" is "{{ ogMsg }}" in 🐷 Latin
		</p>
	`,
})
export class AppComponent {}

bootstrapApplication(AppComponent);

function translatePigLatin(strr: string) {
	// Code originally migrated from:
	// https://www.freecodecamp.org/forum/t/freecodecamp-algorithm-challenge-guide-pig-latin/16039/7
	if (!strr) return "";
	return strr
		.split(" ")
		.map((str) => {
			if (["a", "e", "i", "o", "u"].indexOf(str.charAt(0)) != -1) {
				return (str += "way");
			}
			return str.replace(/([^aeiou]*)([aeiou]\w*)/, "$2$1ay");
		})
		.join(" ");
}
