/**
 * This file came from:
 * https://github.com/FxEmbed/FxEmbed/tree/81bbabb71b8c20e7de77abcfe0e1e60e0d92f62f/src/types
 *
 * But is trimmed for only Twitter/X usage
 */
import {
	BirdwatchEntity,
	TweetMediaVariant,
	TwitterApiMedia,
	TwitterArticleContentState,
} from "./twitter";

export interface TweetAPIResponse {
	code: number;
	message: string;
	tweet?: APITwitterStatus;
}

interface APITranslate {
	text: string;
	source_lang: string;
	source_lang_en: string;
	target_lang: string;
	provider: string;
}

interface APIExternalMedia {
	type: "video";
	url: string;
	thumbnail_url?: string;
	height?: number;
	width?: number;
}

interface APIBroadcast {
	url: string;
	width: number;
	height: number;
	state: "LIVE" | "ENDED";
	broadcaster: {
		username: string;
		display_name: string;
		id: string;
	};
	stream?: {
		url: string;
	};
	title: string;
	source: "Producer" | string; // are there other ones?
	orientation: "landscape" | "portrait"; // in twitter api 0 = landscape, presumably 1 = portrait but i'll want to verify this
	broadcast_id: string; // THis lets us query the actual broadcast information
	media_id: string; // This is part of the Twitter broadcast URL
	media_key: string; // We can query more info about a livestream with this. Not sure if we need it though
	is_high_latency: boolean; // Whether the broadcast is high latency
	thumbnail: {
		original: {
			url: string;
		};
		small?: {
			url: string;
		};
		medium?: {
			url: string;
		};
		large?: {
			url: string;
		};
		x_large?: {
			url: string;
		};
	};
}

interface APIPollChoice {
	label: string;
	count: number;
	percentage: number;
}

interface APIPoll {
	choices: APIPollChoice[];
	total_votes: number;
	ends_at: string;
	time_left_en: string;
}

interface APIMedia {
	id?: string;
	format?: string;
	type: string;
	url: string;
	width: number;
	height: number;
}

interface APIPhoto extends APIMedia {
	type: "photo" | "gif";
	transcode_url?: string;
	altText?: string;
}

interface APIVideo extends APIMedia {
	type: "video" | "gif";
	thumbnail_url: string;
	duration: number;
	filesize?: number; // File size in bytes (when available, e.g., from TikTok)
	variants?: TweetMediaVariant[]; // Legacy API only - use formats internally
	formats: APIVideoFormat[];
}

type APIVideoFormat = {
	container?: "mp4" | "webm" | "m3u8";
	codec?: "h264" | "hevc" | "vp9" | "av1";
	bitrate?: number;
	url: string;
	size?: number; // File size in bytes (when available, e.g., from TikTok)
	height?: number;
	width?: number;
};

interface APIMosaicPhoto extends APIMedia {
	type: "mosaic_photo";
	formats: {
		webp: string;
		jpeg: string;
	};
}

interface APIStatus {
	id: string;
	url: string;
	text: string;
	created_at: string;
	created_timestamp: number;

	likes: number;
	reposts: number;
	replies: number;

	quote?: APIStatus;
	poll?: APIPoll;
	author: APIUser;

	media: {
		external?: APIExternalMedia;
		photos?: APIPhoto[];
		videos?: APIVideo[];
		all?: APIMedia[];
		mosaic?: APIMosaicPhoto;
		broadcast?: APIBroadcast;
	};

	raw_text: {
		text: string;
		facets: APIFacet[];
	};

	lang: string | null;
	translation?: APITranslate;

	possibly_sensitive: boolean;

	replying_to: {
		screen_name: string;
		post: string;
	} | null;

	source: string | null;

	embed_card: "tweet" | "summary" | "summary_large_image" | "player";
	provider: "twitter" | "bsky" | "tiktok";
}

interface APIFacet {
	type: string;
	indices: [start: number, end: number];
	original?: string;
	replacement?: string;
	display?: string;
	id?: string;
}

interface APITwitterCommunityNote {
	text: string;
	entities: BirdwatchEntity[];
}

interface APITwitterStatus extends APIStatus {
	views?: number | null;
	bookmarks?: number | null;
	community?: APITwitterCommunity;
	article?: {
		created_at: string;
		modified_at?: string;
		id: string;
		title: string;
		preview_text: string;
		cover_media: TwitterApiMedia;
		content: TwitterArticleContentState;
		media_entities: TwitterApiMedia[];
	};
	is_note_tweet: boolean;
	community_note: APITwitterCommunityNote | null;
	provider: "twitter";
}

interface APIUser {
	id: string;
	name: string;
	screen_name: string;
	avatar_url: string | null;
	banner_url: string | null;
	// verified: 'legacy' | 'blue'| 'business' | 'government';
	// verified_label: string;
	description: string;
	location: string;
	url: string;
	protected: boolean;
	followers: number;
	following: number;
	statuses: number;
	media_count: number;
	likes: number;
	joined: string;
	website: {
		url: string;
		display_url: string;
	} | null;
	birthday: {
		day?: number;
		month?: number;
		year?: number;
	};
	verification?: {
		verified: boolean;
		type: "organization" | "government" | "individual" | null;
		verified_at?: string | null;
		identity_verified?: boolean;
	};
	about_account?: {
		based_in?: string | null;
		location_accurate?: boolean;
		created_country_accurate?: boolean | null;
		source?: string | null;
		username_changes?: {
			count: number;
			last_changed_at: string | null;
		};
	};
}

interface APITwitterCommunity {
	id: string;
	name: string;
	description: string;
	created_at: string;
	search_tags: string[];
	is_nsfw: boolean;
	topic: string | null;
	admin: APIUser | null;
	creator: APIUser | null;
	join_policy: "Open" | "Closed";
	invites_policy: "MemberInvitesAllowed" | "MemberInvitesDisabled";
	is_pinned: boolean;
}
