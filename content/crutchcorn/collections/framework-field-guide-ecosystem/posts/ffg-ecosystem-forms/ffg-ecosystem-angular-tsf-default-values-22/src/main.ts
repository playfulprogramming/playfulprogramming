import { bootstrapApplication } from "@angular/platform-browser";
import {
	ChangeDetectionStrategy,
	Component,
	provideZonelessChangeDetection,
} from "@angular/core";
import { injectForm, TanStackField } from "@tanstack/angular-form";

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TanStackField],
	template: `
		<form (submit)="onSubmit($event)">
			<ng-container
				[tanstackField]="form"
				name="usersName"
				#usersName="field"
			>
				<input
					[value]="usersName.api.state.value"
					(input)="usersName.api.handleChange($any($event).target.value)"
				/>
			</ng-container>
			<button type="submit">Submit</button>
		</form>
	`,
})
export class App {
	form = injectForm({
		defaultValues: {
			usersName: ""
		},
		onSubmit: ({value}) => {
			console.log("Form submitted with values:", value);
		}
	});

	onSubmit(event: Event) {
		event.preventDefault();
		this.form.handleSubmit();
	}
}

void bootstrapApplication(App, {
	providers: [provideZonelessChangeDetection()],
});
