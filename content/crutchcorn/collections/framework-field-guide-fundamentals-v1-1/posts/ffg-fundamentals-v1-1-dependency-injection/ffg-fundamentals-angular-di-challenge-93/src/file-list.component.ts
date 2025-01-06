// file-list.component.ts
import { Component, inject, Injectable } from "@angular/core";
import { ActionTypes } from "./context";

import { FileComponent } from "./file.component";

@Injectable()
class FileListActions {
	actions = [] as any[];
}

function injectAndAssignActions(actions: any[]) {
	const sidebarDirectories = inject(ActionTypes);
	sidebarDirectories.actions = actions;
	return sidebarDirectories;
}

@Component({
	selector: "file-list",
	standalone: true,
	imports: [FileComponent],
	providers: [
		{
			provide: ActionTypes,
			useClass: FileListActions,
		},
	],
	template: `
		<div style="padding: 1rem">
			<h1>Files</h1>
			@for (file of files; track file.id) {
				<file-item [name]="file.name" [id]="file.id" />
			}
		</div>
	`,
})
export class FileListComponent {
	files = [
		{
			name: "Testing.wav",
			id: 1,
		},
		{
			name: "Secrets.txt",
			id: 2,
		},
		{
			name: "Other.md",
			id: 3,
		},
	];

	getFileIndexById = (id: number) => {
		return this.files.findIndex((file) => file.id === id);
	};

	onRename = (id: number) => {
		const fileIndex = this.getFileIndexById(id)!;
		const file = this.files[fileIndex];
		const newName = prompt(
			`What do you want to rename the file ${file.name} to?`,
		);
		if (!newName) return;
		this.files[fileIndex] = {
			...file,
			name: newName,
		};
	};

	onDelete = (id: number) => {
		const fileIndex = this.getFileIndexById(id);
		this.files.splice(fileIndex, 1);
	};

	fileListActions = injectAndAssignActions([
		{
			label: "Rename",
			fn: this.onRename,
		},
		{
			label: "Delete",
			fn: this.onDelete,
		},
	]);
}
