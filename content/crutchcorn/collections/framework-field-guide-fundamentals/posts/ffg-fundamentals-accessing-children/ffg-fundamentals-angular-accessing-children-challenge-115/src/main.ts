import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	contentChild,
	input,
	TemplateRef,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
	selector: "table-comp",
	imports: [NgTemplateOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<table>
			<thead>
				<ng-template
					[ngTemplateOutlet]="header()"
					[ngTemplateOutletContext]="{ length: data().length }"
				/>
			</thead>

			<tbody>
				@for (item of data(); track item; let index = $index) {
					<ng-template
						[ngTemplateOutlet]="body()"
						[ngTemplateOutletContext]="{ rowI: index, value: item }"
					/>
				}
			</tbody>
		</table>
	`,
})
class TableComponent {
	header = contentChild.required("header", { read: TemplateRef });
	body = contentChild.required("body", { read: TemplateRef });

	data = input.required<any[]>();
}

@Component({
	selector: "app-root",
	imports: [TableComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<table-comp [data]="data">
			<ng-template #header let-length="length">
				<tr>
					<th>{{ length }} items</th>
				</tr>
			</ng-template>
			<ng-template #body let-rowI="rowI" let-value="value">
				<tr>
					<td
						[style]="
							rowI % 2 ? 'background: lightgrey' : 'background: lightblue'
						"
					>
						{{ value.name }}
					</td>
				</tr>
			</ng-template>
		</table-comp>
	`,
})
class AppComponent {
	data = [
		{
			name: "Corbin",
			age: 24,
		},
		{
			name: "Joely",
			age: 28,
		},
		{
			name: "Frank",
			age: 33,
		},
	];
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
