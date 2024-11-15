import { bootstrapApplication } from "@angular/platform-browser";

import {
	Directive,
	Component,
	inject,
	TemplateRef,
	ViewContainerRef,
	EmbeddedViewRef,
	input,
	effect,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

const flags: Record<string, boolean> = {
	addToCartButton: true,
	purchaseThisItemButton: false,
};

@Directive({
	selector: "[featureFlag]",
})
class FeatureFlagDirective {
	featureFlag = input.required<string>();

	templToRender = inject(TemplateRef);
	parentViewRef = inject(ViewContainerRef);

	embeddedView: EmbeddedViewRef<any> | null = null;

	constructor() {
		effect(() => {
			if (flags[this.featureFlag()]) {
				this.embeddedView = this.parentViewRef.createEmbeddedView(
					this.templToRender,
				);
			} else if (this.embeddedView) {
				this.embeddedView.destroy();
			}
		});
	}
}

@Component({
	selector: "app-root",
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

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
