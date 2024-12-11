import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	signal,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "delete-modal",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<div class="modal-container">
				<h1 class="title">Are you sure you want to delete that file?</h1>
				<p class="body-text">
					Deleting this file is a permanent action. You’re unable to recover
					this file at a later date. Are you sure you want to delete this file?
				</p>
				<div class="buttons-container">
					<button class="cancel">Cancel</button>
					<button class="confirm">Confirm</button>
				</div>
			</div>
		</div>
	`,
})
class ModalComponent {}

@Component({
	selector: "delete-icon",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<svg viewBox="0 0 20 21">
			<path d="M9 8V16H7.5L7 8H9Z" fill="currentColor" />
			<path d="M12.5 16L13 8H11V16H12.5Z" fill="currentColor" />
			<path
				d="M8 0C7.56957 0 7.18743 0.27543 7.05132 0.683772L6.27924 3H1C0.447715 3 0 3.44772 0 4C0 4.55228 0.447715 5 1 5H2.56055L3.38474 18.1871C3.48356 19.7682 4.79471 21 6.3789 21H13.6211C15.2053 21 16.5164 19.7682 16.6153 18.1871L17.4395 5H19C19.5523 5 20 4.55228 20 4C20 3.44772 19.5523 3 19 3H13.7208L12.9487 0.683772C12.8126 0.27543 12.4304 0 12 0H8ZM12.9767 5C12.9921 5.00036 13.0076 5.00036 13.0231 5H15.4355L14.6192 18.0624C14.5862 18.5894 14.1492 19 13.6211 19H6.3789C5.85084 19 5.41379 18.5894 5.38085 18.0624L4.56445 5H6.97694C6.99244 5.00036 7.00792 5.00036 7.02334 5H12.9767ZM11.6126 3H8.38743L8.72076 2H11.2792L11.6126 3Z"
				fill="currentColor"
			/>
		</svg>
	`,
})
class DeleteIconComponent {}

@Component({
	selector: "folder-icon",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<svg viewBox="0 0 20 16">
			<path
				d="M20 14C20 15.1046 19.1046 16 18 16H2C0.895431 16 0 15.1046 0 14V2C0 0.895431 0.89543 0 2 0H11C11.7403 0 12.3866 0.402199 12.7324 1H18C19.1046 1 20 1.89543 20 3V14ZM11 4V2H2V14H18V6H13C11.8954 6 11 5.10457 11 4ZM13 3V4H18V3H13Z"
				fill="currentColor"
			/>
		</svg>
	`,
})
class FolderIconComponent {}

@Component({
	selector: "footer-comp",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <div class="footer-container">Copyright 2022</div> `,
})
class FooterComponent {}

@Component({
	selector: "body-comp",
	imports: [FolderIconComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ul class="list-container">
			@for (fileIdx of files; track fileIdx) {
				<li class="list-item">
					<folder-icon />
					<span>File number {{ fileIdx + 1 }}</span>
				</li>
			}
		</ul>
	`,
})
class BodyComponent {
	files = Array.from({ length: 10 }, (_, i) => i);
}

@Component({
	selector: "header-comp",
	imports: [ModalComponent, FolderIconComponent, DeleteIconComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="header-container">
			@if (shouldShowModal()) {
				<delete-modal />
			}
			<span class="icon-container">
				<folder-icon />
			</span>
			<span class="header-title">Main folder</span>
			<span class="auto"></span>
			<button class="icon-btn" (click)="showModal()">
				<delete-icon />
			</button>
		</div>
	`,
})
class HeaderComponent {
	shouldShowModal = signal(false);

	showModal() {
		this.shouldShowModal.set(true);
	}
}

@Component({
	selector: "app-root",
	imports: [HeaderComponent, BodyComponent, FooterComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<header-comp />
			<body-comp />
			<footer-comp />
		</div>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
