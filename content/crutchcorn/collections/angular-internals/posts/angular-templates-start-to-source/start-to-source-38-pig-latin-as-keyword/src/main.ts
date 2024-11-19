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

import { UpperCasePipe } from "@angular/common";

@Directive({
	selector: "[makePiglatin]",
	standalone: true,
})
class MakePigLatinDirective implements OnInit {
	constructor(
		private templ: TemplateRef<any>,
		private parentViewRef: ViewContainerRef,
	) {}

	@Input() makePiglatin!: string;
	@Input() makePiglatinCasing!: string;

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
			makePiglatinCasing: this.makePiglatinCasing,
		});
	}
}

@Component({
	selector: "my-app",
	standalone: true,
	imports: [MakePigLatinDirective, UpperCasePipe],
	template: `
		<p
			*makePiglatin="
				'test';
				let msg;
				casing: 'upper' | uppercase as upperInUpper
			"
		>
			{{ upperInUpper }}: {{ msg }}
		</p>
	`,
})
class AppComponent {}

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
