interface People {
	id: number;
	picture: string;
	name: string;
}

interface EventPresenter {
	id: number;
	order: number;
	person: People;
}

export interface EventBlock {
	slug: string;
	banner_image?: string;
	title?: string;
	description?: string;
	starts_at: Date;
	ends_at: Date;
	timezone: string;
	location_description: string;
	location_address?: string;
	location_url?: string;
	presenters: EventPresenter[];
}

interface EventOrganizer {
	id: number;
	order: number;
	person: People;
}

export interface Event {
	slug: string;
	banner_image?: string;
	title: string;
	description: string;
	location_description: string;
	location_address?: string;
	location_url?: string;
	blocks: EventBlock[];
	organizers: EventOrganizer[];
	// Added in on top of the DB schema outlined by @fennifith
	in_person: boolean;
	is_online: true;
	is_recurring: boolean;
}
