// App.component.ts
import {
	Component,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";
import { LayoutComponent } from "./layout.component";
import { SidebarComponent } from "./sidebar.component";
import { FileListComponent } from "./file-list.component";

@Component({
	selector: "app-root",
	imports: [LayoutComponent, SidebarComponent, FileListComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<app-layout>
			<app-sidebar sidebar />
			<file-list />
		</app-layout>
	`,
})
export class AppComponent {}
