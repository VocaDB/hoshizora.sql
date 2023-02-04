import { TranslatedString } from '@/entities/TranslatedString';

export enum SongType {
	'Unspecified' = 'Unspecified',
	'Original' = 'Original',
	'Remaster' = 'Remaster',
	'Remix' = 'Remix',
	'Cover' = 'Cover',
	'Arrangement' = 'Arrangement',
	'Instrumental' = 'Instrumental',
	'Mashup' = 'Mashup',
	'MusicPV' = 'MusicPV',
	'DramaPV' = 'DramaPV',
	'Live' = 'Live',
	'Illustration' = 'Illustration',
	'Other' = 'Other',
}

export interface Song extends TranslatedString {
	id: number;
	lengthSeconds: number;
	maxMilliBpm: number | undefined;
	minMilliBpm: number | undefined;
	nicoId: string | undefined;
	notesOriginal: string;
	notesEnglish: string;
	originalVersionId: number | undefined;
	publishDate: Date | undefined;
	releaseEventId: number | undefined;
	songType: SongType;
}
