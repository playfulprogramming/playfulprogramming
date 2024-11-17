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
	selector: "[renderThis]",
	standalone: true,
})
export class RenderThisDirective implements OnInit {
	constructor(
		private templ: TemplateRef<any>,
		private parentViewRef: ViewContainerRef,
	) {}

	ngOnInit(): void {
		this.parentViewRef.createEmbeddedView(this.templ);
	}
}

@Component({
	selector: "my-app",
	standalone: true,
	imports: [RenderThisDirective],
	template: `
		<p *renderThis>Rendering from <code>structural directive</code></p>
	`,
})
export class AppComponent {}

bootstrapApplication(AppComponent);
