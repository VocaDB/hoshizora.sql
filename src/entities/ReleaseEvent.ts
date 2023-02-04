import { TranslatedString } from '@/entities/TranslatedString';

export enum ReleaseEventCategory {
	'Unspecified' = 'Unspecified',
	'AlbumRelease' = 'AlbumRelease',
	'Anniversary' = 'Anniversary',
	'Club' = 'Club',
	'Concert' = 'Concert',
	'Contest' = 'Contest',
	'Convention' = 'Convention',
	'Other' = 'Other',
	'Festival' = 'Festival',
}

export interface ReleaseEvent extends TranslatedString {
	id: number;
	category: ReleaseEventCategory;
	date: Date | undefined;
	description: string;
	mainPictureMime: string | undefined;
	seriesId: number | undefined;
	seriesNumber: number;
	venueName: string | undefined;
}
