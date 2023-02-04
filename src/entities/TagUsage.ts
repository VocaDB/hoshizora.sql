interface TagUsage {
	tagId: number;
	count: number;
}

export interface AlbumTagUsage extends TagUsage {
	albumId: number;
}

export interface ArtistTagUsage extends TagUsage {
	artistId: number;
}

export interface ReleaseEventSeriesTagUsage extends TagUsage {
	releaseEventSeriesId: number;
}

export interface ReleaseEventTagUsage extends TagUsage {
	releaseEventId: number;
}

export interface SongTagUsage extends TagUsage {
	songId: number;
}
