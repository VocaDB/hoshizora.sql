import { ArtistLinkType } from '@/entities/ArtistForArtist';

export interface ObjectRefContract {
	id: number;
	nameHint?: string;
}

export interface AlbumForSongRefContract extends ObjectRefContract {
	discNumber: number;
	trackNumber: number;
}

export interface ArchivedArtistForAlbumContract
	extends Omit<ObjectRefContract, 'id'> {
	id?: number;
	isSupport: boolean;
	roles: number;
}

export interface ArchivedArtistForArtistContract extends ObjectRefContract {
	linkType: ArtistLinkType;
}

export interface ArchivedArtistForSongContract
	extends Omit<ObjectRefContract, 'id'> {
	id?: number;
	isSupport: boolean;
	roles: number;
}

export interface ArchivedArtistForReleaseEventContract
	extends Omit<ObjectRefContract, 'id'> {
	id?: number;
	roles: number;
}

export interface SongInAlbumRefContract extends Omit<ObjectRefContract, 'id'> {
	id?: number;
	discNumber: number;
	trackNumber: number;
}
