import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Directive,
	Component,
	OnInit,
	Input,
	inject,
	TemplateRef,
} from "@angular/core";

function injectTemplateAndLog() {
	const template = inject(TemplateRef);
	console.log(template);
	return template;
}

@Directive({
	selector: "[item]",
	standalone: true,
})
class ItemDirective {
	_template = injectTemplateAndLog();
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ItemDirective],
	template: `
		<div>
			<ng-template item>
				<p>Hello, world!</p>
			</ng-template>
		</div>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
