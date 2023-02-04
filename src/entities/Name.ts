interface Name {
	language: string;
	value: string;
}

export interface AlbumName extends Name {
	albumId: number;
}

export interface ArtistName extends Name {
	artistId: number;
}

export interface ReleaseEventSeriesName extends Name {
	releaseEventSeriesId: number;
}

export interface ReleaseEventName extends Name {
	releaseEventId: number;
}

export interface SongName extends Name {
	songId: number;
}

export interface TagName extends Name {
	tagId: number;
}
