import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ViewContainerRef,
	Input,
	TemplateRef,
	Directive,
} from "@angular/core";

@Directive({
	selector: "[makePiglatin]",
})
export class MakePigLatinDirective {
	constructor(
		private templ: TemplateRef<any>,
		private parentViewRef: ViewContainerRef,
	) {}

	@Input() set makePiglatin(val: string) {
		this.parentViewRef.createEmbeddedView(this.templ, {
			$implicit: translatePigLatin(val),
		});
	}
}

@Component({
	selector: "my-app",
	imports: [MakePigLatinDirective],
	template: `
		<p *makePiglatin="'This is a string'; let msg">
			{{ msg }}
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
