// file-list.component.ts
import { Component, inject, Injectable, signal } from "@angular/core";
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
			@for (file of files(); track file.id) {
				<file-item [name]="file.name" [id]="file.id" />
			}
		</div>
	`,
})
export class FileListComponent {
	files = signal([
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
	]);

	getFileIndexById = (id: number) => {
		return this.files().findIndex((file) => file.id === id);
	};

	onRename = (id: number) => {
		const fileIndex = this.getFileIndexById(id)!;
		const file = this.files()[fileIndex];
		const newName = prompt(
			`What do you want to rename the file ${file.name} to?`,
		);
		if (!newName) return;
		const newFiles = this.files();
		newFiles[fileIndex] = {
			...file,
			name: newName,
		};
		this.files.set(newFiles);
	};

	onDelete = (id: number) => {
		const fileIndex = this.getFileIndexById(id);
		const newFiles = this.files();
		newFiles.splice(fileIndex, 1);
		this.files.set(newFiles);
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
