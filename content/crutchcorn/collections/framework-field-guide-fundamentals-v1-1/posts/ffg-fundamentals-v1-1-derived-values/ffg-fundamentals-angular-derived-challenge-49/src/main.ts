import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Input, Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "formatBytes", standalone: true })
class FormatBytesPipe implements PipeTransform {
	kilobyte = 1024;
	megabyte = this.kilobyte * 1024;
	gigabyte = this.megabyte * 1024;

	transform(bytes: number): string {
		if (bytes < this.kilobyte) {
			return `${bytes} B`;
		} else if (bytes < this.megabyte) {
			return `${Math.floor(bytes / this.kilobyte)} KB`;
		} else if (bytes < this.gigabyte) {
			return `${Math.floor(bytes / this.megabyte)} MB`;
		} else {
			return `${Math.floor(bytes / this.gigabyte)} GB`;
		}
	}
}

@Component({
	selector: "display-size",
	standalone: true,
	imports: [FormatBytesPipe],
	template: `<p>{{ bytes | formatBytes }}</p>`,
})
class DisplaySizeComponent {
	@Input() bytes!: number;
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [DisplaySizeComponent],
	template: `
		<table>
			<thead>
				<tr>
					<th>Bytes</th>
					<th>Human Readable</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						<p>138 bytes</p>
					</td>
					<td>
						<display-size [bytes]="138" />
					</td>
				</tr>
				<tr>
					<td>
						<p>13,876 bytes</p>
					</td>
					<td>
						<display-size [bytes]="13876" />
					</td>
				</tr>
				<tr>
					<td>
						<p>13,876,435 bytes</p>
					</td>
					<td>
						<display-size [bytes]="13876435" />
					</td>
				</tr>
				<tr>
					<td>
						<p>13,876,435,892 bytes</p>
					</td>
					<td>
						<display-size [bytes]="13876435892" />
					</td>
				</tr>
			</tbody>
		</table>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
