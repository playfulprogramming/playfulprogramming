import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, computed, input } from "@angular/core";

const kilobyte = 1024;
const megabyte = kilobyte * 1024;
const gigabyte = megabyte * 1024;

function formatBytes(bytes: number) {
	if (bytes < kilobyte) {
		return `${bytes} B`;
	} else if (bytes < megabyte) {
		return `${Math.floor(bytes / kilobyte)} KB`;
	} else if (bytes < gigabyte) {
		return `${Math.floor(bytes / megabyte)} MB`;
	} else {
		return `${Math.floor(bytes / gigabyte)} GB`;
	}
}

@Component({
	selector: "display-size",
	template: `<p>{{ readableBytes() }}</p>`,
})
class DisplaySizeComponent {
	bytes = input.required<number>();

	readableBytes = computed(() => formatBytes(this.bytes()));
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
