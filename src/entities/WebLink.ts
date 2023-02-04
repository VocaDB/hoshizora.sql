export enum WebLinkCategory {
	Official = 'Official',
	Commercial = 'Commercial',
	Reference = 'Reference',
	Other = 'Other',
}

interface WebLink {
	category: WebLinkCategory;
	description: string;
	url: string;
	disabled: boolean;
}

export interface AlbumWebLink extends WebLink {
	albumId: number;
}

export interface ArtistWebLink extends WebLink {
	artistId: number;
}

export interface ReleaseEventSeriesWebLink extends WebLink {
	releaseEventSeriesId: number;
}

export interface ReleaseEventWebLink extends WebLink {
	releaseEventId: number;
}

export interface SongWebLink extends WebLink {
	songId: number;
}

export interface TagWebLink extends WebLink {
	tagId: number;
}
