import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Directive,
	Component,
	inject,
	TemplateRef,
	ViewContainerRef,
	OnChanges,
	Input,
	EmbeddedViewRef,
} from "@angular/core";

const flags: Record<string, boolean> = {
	addToCartButton: true,
	purchaseThisItemButton: false,
};

@Directive({
	selector: "[featureFlag]",
	standalone: true,
})
class FeatureFlagDirective implements OnChanges {
	@Input() featureFlag!: string;

	templToRender = inject(TemplateRef<any>);
	parentViewRef = inject(ViewContainerRef);

	embeddedView: EmbeddedViewRef<any> | null = null;

	ngOnChanges() {
		if (flags[this.featureFlag]) {
			this.embeddedView = this.parentViewRef.createEmbeddedView(
				this.templToRender,
			);
		} else if (this.embeddedView) {
			this.embeddedView.destroy();
		}
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [FeatureFlagDirective],
	template: `
		<div>
			<button *featureFlag="'addToCartButton'">Add to cart</button>
			<button *featureFlag="'purchaseThisItemButton'">
				Purchase this item
			</button>
		</div>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
