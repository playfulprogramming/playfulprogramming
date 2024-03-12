import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, ContentChild, Input, TemplateRef } from "@angular/core";
import { NgFor, NgTemplateOutlet } from "@angular/common";

@Component({
	selector: "table-comp",
	standalone: true,
	imports: [NgFor, NgTemplateOutlet],
	template: `
		<table>
			<thead>
				<ng-template
					[ngTemplateOutlet]="header"
					[ngTemplateOutletContext]="{ length: data.length }"
				/>
			</thead>

			<tbody>
				<ng-template
					*ngFor="let item of data; let index = index"
					[ngTemplateOutlet]="body"
					[ngTemplateOutletContext]="{ rowI: index, value: item }"
				/>
			</tbody>
		</table>
	`,
})
class TableComponent {
	@ContentChild("header", { read: TemplateRef }) header!: TemplateRef<any>;
	@ContentChild("body", { read: TemplateRef }) body!: TemplateRef<any>;

	@Input() data!: any[];
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [TableComponent],
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

bootstrapApplication(AppComponent);
