export enum PVType {
	Original = 'Original',
	Reprint = 'Reprint',
	Other = 'Other',
}

export enum PVService {
	'NicoNicoDouga' = 'NicoNicoDouga',
	'Youtube' = 'Youtube',
	'SoundCloud' = 'SoundCloud',
	'Vimeo' = 'Vimeo',
	'Piapro' = 'Piapro',
	'Bilibili' = 'Bilibili',
	'File' = 'File',
	'LocalFile' = 'LocalFile',
	'Creofuga' = 'Creofuga',
	'Bandcamp' = 'Bandcamp',
}

interface PV {
	author: string;
	name: string;
	pvId: string;
	pvType: PVType;
	service: PVService;
	extendedMetadata: string | undefined;
	publishDate: Date | undefined;
}

export interface PVForAlbum extends PV {
	albumId: number;
}

export interface PVForReleaseEvent extends PV {
	releaseEventId: number;
}

export interface PVForSong extends PV {
	songId: number;
}
