import { bootstrapApplication } from "@angular/platform-browser";
import {
	AfterContentChecked,
	AfterContentInit,
	AfterViewChecked,
	AfterViewInit,
	DoCheck,
	effect,
	ElementRef,
	OnInit,
	provideExperimentalZonelessChangeDetection,
	untracked,
	viewChild,
	Component,
	ChangeDetectionStrategy,
	afterRenderEffect,
} from "@angular/core";

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `@if (true) {
		<div #test></div>
	}`,
})
class App
	implements
		OnInit,
		DoCheck,
		AfterContentInit,
		AfterViewInit,
		AfterContentChecked,
		AfterViewChecked
{
	test = viewChild("test", { read: ElementRef<HTMLDivElement> });

	constructor() {
		console.log("CONSTRUCTOR", { test: untracked(this.test)?.nativeElement });
	}

	_root_effect = effect(
		() => {
			console.log("ROOT EFFECT", { test: untracked(this.test)?.nativeElement });
		},
		{ forceRoot: true },
	);

	_effect = effect(() => {
		console.log("EFFECT", { test: untracked(this.test)?.nativeElement });
	});

	_after_render_effect = afterRenderEffect(() => {
		console.log("AFTERRENDEREFFECT", {
			test: untracked(this.test)?.nativeElement,
		});
	});

	ngOnInit() {
		console.log("INIT", { test: untracked(this.test)?.nativeElement });
	}

	ngDoCheck() {
		console.log("DOCHECK", { test: untracked(this.test)?.nativeElement });
	}

	ngAfterContentInit() {
		console.log("AFTERCONTENTINIT", {
			test: untracked(this.test)?.nativeElement,
		});
	}

	ngAfterViewInit() {
		console.log("AFTERVIEWINIT", { test: untracked(this.test)?.nativeElement });
	}

	ngAfterContentChecked() {
		console.log("AFTERCONTENTCHECKED", {
			test: untracked(this.test)?.nativeElement,
		});
	}

	ngAfterViewChecked() {
		console.log("AFTERVIEWCHECKED", {
			test: untracked(this.test)?.nativeElement,
		});
	}
}

bootstrapApplication(App, {
	providers: [provideExperimentalZonelessChangeDetection()],
}).catch((err) => console.error(err));
