import { TranslatedString } from '@/entities/TranslatedString';

export enum DiscType {
	'Unknown' = 'Unknown',
	'Album' = 'Album',
	'Single' = 'Single',
	'EP' = 'EP',
	'SplitAlbum' = 'SplitAlbum',
	'Compilation' = 'Compilation',
	'Video' = 'Video',
	'Artbook' = 'Artbook',
	'Game' = 'Game',
	'Fanmade' = 'Fanmade',
	'Instrumental' = 'Instrumental',
	'Other' = 'Other',
}

export interface Album extends TranslatedString {
	id: number;
	descriptionOriginal: string;
	descriptionEnglish: string;
	discType: DiscType;
	mainPictureMime: string | undefined;
	originalReleaseCatNum: string | undefined;
	originalReleaseDay: number | undefined;
	originalReleaseMonth: number | undefined;
	originalReleaseReleaseEventId: number | undefined;
	originalReleaseYear: number | undefined;
}
