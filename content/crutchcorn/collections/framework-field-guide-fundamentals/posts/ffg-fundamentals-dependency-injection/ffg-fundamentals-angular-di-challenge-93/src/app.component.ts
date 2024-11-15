// App.component.ts
import {
	Component,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { LayoutComponent } from "./layout.component";
import { SidebarComponent } from "./sidebar.component";
import { FileListComponent } from "./file-list.component";

@Component({
	selector: "app-root",
	imports: [LayoutComponent, SidebarComponent, FileListComponent],
	template: `
		<app-layout>
			<app-sidebar sidebar />
			<file-list />
		</app-layout>
	`,
})
export class AppComponent {}
