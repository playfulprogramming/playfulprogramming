import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import {
	AfterViewInit,
	Component,
	DoCheck,
	OnInit,
	TemplateRef,
	ViewChild,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
	selector: "my-app",
	standalone: true,
	imports: [NgTemplateOutlet],
	template: `
		<ng-template #helloThereMsg>
			Hello There!
			<ng-template #testingMessage>Testing 123</ng-template>
		</ng-template>
		<ng-template [ngTemplateOutlet]="helloThereMsg"></ng-template>
		<ng-template [ngTemplateOutlet]="realMsgVar"></ng-template>
	`,
})
export class AppComponent implements OnInit, DoCheck, AfterViewInit {
	realMsgVar!: TemplateRef<any>;
	@ViewChild("testingMessage", { static: false })
	testingMessageCompVar!: TemplateRef<any>;

	ngOnInit() {
		console.log(
			"ngOnInit: The template is present?",
			!!this.testingMessageCompVar,
		);
	}

	ngDoCheck() {
		console.log(
			"ngDoCheck: The template is present?",
			!!this.testingMessageCompVar,
		);
		this.realMsgVar = this.testingMessageCompVar;
	}

	ngAfterViewInit() {
		console.log(
			"ngAfterViewInit: The template is present?",
			!!this.testingMessageCompVar,
		);
	}
}

bootstrapApplication(AppComponent);
