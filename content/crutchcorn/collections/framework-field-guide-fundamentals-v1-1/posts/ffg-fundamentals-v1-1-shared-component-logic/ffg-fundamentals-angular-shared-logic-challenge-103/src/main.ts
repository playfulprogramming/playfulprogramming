import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Injectable,
	Component,
	OnDestroy,
	ElementRef,
	EventEmitter,
	ViewChildren,
	ViewChild,
	QueryList,
	Output,
	Input,
	inject,
	OnInit,
	AfterViewInit,
} from "@angular/core";

@Injectable()
class CloseIfOutSideContext implements OnDestroy {
	getCloseIfOutsideFunction = (
		contextMenu: ElementRef<HTMLElement>,
		close: EventEmitter<any>,
	) => {
		return (e: MouseEvent) => {
			const contextMenuEl = contextMenu?.nativeElement;
			if (!contextMenuEl) return;
			const isClickInside = contextMenuEl.contains(e.target as HTMLElement);
			if (isClickInside) return;
			close.emit();
		};
	};

	setup(contextMenu: ElementRef<HTMLElement>, close: EventEmitter<any>) {
		this.closeIfOutsideOfContext = this.getCloseIfOutsideFunction(
			contextMenu,
			close,
		);
		document.addEventListener("click", this.closeIfOutsideOfContext);
	}

	ngOnDestroy() {
		document.removeEventListener("click", this.closeIfOutsideOfContext);
		this.closeIfOutsideOfContext = () => {};
	}

	closeIfOutsideOfContext: (e: MouseEvent) => void = () => {};
}

@Component({
	selector: "context-menu",
	standalone: true,
	template: `
		<div
			#contextMenu
			tabIndex="0"
			[style]="{
				position: 'fixed',
				top: y + 20,
				left: x + 20,
				background: 'white',
				border: '1px solid black',
				borderRadius: 16,
				padding: '1rem',
			}"
		>
			<button (click)="close.emit()">X</button>
			This is a context menu
		</div>
	`,
	providers: [CloseIfOutSideContext],
})
class ContextMenuComponent implements OnInit {
	@ViewChild("contextMenu", { static: true })
	contextMenu!: ElementRef<HTMLElement>;

	@Input() x: number = 0;
	@Input() y: number = 0;
	@Output() close = new EventEmitter();

	closeIfOutside = inject(CloseIfOutSideContext);

	ngOnInit() {
		this.closeIfOutside.setup(this.contextMenu, this.close);
	}

	focus() {
		this.contextMenu.nativeElement.focus();
	}
}

@Injectable()
class BoundsContext implements OnDestroy {
	bounds = {
		height: 0,
		width: 0,
		x: 0,
		y: 0,
	};

	contextOrigin: ElementRef | undefined;

	resizeListener = () => {
		if (!this.contextOrigin) return;
		this.bounds = this.contextOrigin.nativeElement.getBoundingClientRect();
	};

	setup(contextOrigin: ElementRef) {
		this.bounds = contextOrigin.nativeElement.getBoundingClientRect();
		this.contextOrigin = contextOrigin;

		window.addEventListener("resize", this.resizeListener);
	}

	ngOnDestroy() {
		window.removeEventListener("resize", this.resizeListener);
		this.contextOrigin = undefined;
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ContextMenuComponent],
	template: `
		<div [style]="{ marginTop: '5rem', marginLeft: '5rem' }">
			<div #contextOrigin (contextmenu)="open($event)">Right click on me!</div>
		</div>
		@if (isOpen) {
			<context-menu
				#contextMenu
				[x]="boundsContext.bounds.x"
				[y]="boundsContext.bounds.y"
				(close)="close()"
			></context-menu>
		}
	`,
	providers: [BoundsContext],
})
class AppComponent implements AfterViewInit {
	@ViewChild("contextOrigin")
	contextOrigin!: ElementRef<HTMLElement>;
	@ViewChildren("contextMenu") contextMenu!: QueryList<ContextMenuComponent>;

	isOpen = false;

	boundsContext = inject(BoundsContext);

	ngAfterViewInit() {
		this.boundsContext.setup(this.contextOrigin);
		this.contextMenu.changes.forEach(() => {
			const isLoaded = this?.contextMenu?.first;
			if (!isLoaded) return;
			this.contextMenu.first.focus();
		});
	}

	close() {
		this.isOpen = false;
	}

	open(e: UIEvent) {
		e.preventDefault();
		this.isOpen = true;
	}
}

bootstrapApplication(AppComponent);
