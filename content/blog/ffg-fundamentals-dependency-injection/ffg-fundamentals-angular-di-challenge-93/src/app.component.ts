// App.component.ts
import { Component } from "@angular/core";
import { LayoutComponent } from "./layout.component";
import { SidebarComponent } from "./sidebar.component";
import { FileListComponent } from "./file-list.component";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [LayoutComponent, SidebarComponent, FileListComponent],
	template: `
		<app-layout>
			<app-sidebar sidebar />
			<file-list />
		</app-layout>
	`,
})
export class AppComponent {}
