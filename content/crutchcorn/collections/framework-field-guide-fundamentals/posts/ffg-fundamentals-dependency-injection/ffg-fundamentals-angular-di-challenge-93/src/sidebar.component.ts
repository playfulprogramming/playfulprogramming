// sidebar.component.ts
import {
	Component,
	inject,
	Injectable,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { ActionTypes } from "./context";

import { FileComponent } from "./file.component";

@Injectable()
class SidebarDirectories {
	actions = [] as any[];
}

function injectAndAssignActions(actions: any[]) {
	const sidebarDirectories = inject(ActionTypes);
	sidebarDirectories.actions = actions;
	return sidebarDirectories;
}

@Component({
	selector: "app-sidebar",
	imports: [FileComponent],
	providers: [
		{
			provide: ActionTypes,
			useClass: SidebarDirectories,
		},
	],
	template: `
		<div style="padding: 1rem">
			<h1 style="font-size: 1.25rem">Directories</h1>
			@for (directory of directories; track directory.id) {
				<file-item [name]="directory.name" [id]="directory.id" />
			}
		</div>
	`,
})
export class SidebarComponent {
	directories = [
		{
			name: "Movies",
			id: 1,
		},
		{
			name: "Documents",
			id: 2,
		},
		{
			name: "Etc",
			id: 3,
		},
	];

	getDirectoryById = (id: number) => {
		return this.directories.find((dir) => dir.id === id);
	};

	onCopy = (id: number) => {
		const dir = this.getDirectoryById(id)!;
		// Some browsers still do not support this
		if (navigator?.clipboard?.writeText) {
			navigator.clipboard.writeText(dir.name);
			alert("Name is copied");
		} else {
			alert("Unable to copy directory name due to browser incompatibility");
		}
	};

	sidebarDirectories = injectAndAssignActions([
		{
			label: "Copy directory name",
			fn: this.onCopy,
		},
	]);
}
