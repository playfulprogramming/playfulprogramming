// context.ts
import { Injectable } from "@angular/core";

@Injectable()
export class ActionTypes {
	actions = [] as Array<{ label: string; fn: (id: number) => void }>;
}
