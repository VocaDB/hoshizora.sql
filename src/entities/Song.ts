import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { TranslatedString } from '@/entities/TranslatedString';
import { escape } from 'sqlstring';

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

export const SongTableColumnNames: readonly CamelToSnakeCase<keyof Song>[] = [
	'id',
	'length_seconds',
	'max_milli_bpm',
	'min_milli_bpm',
	'nico_id',
	'notes_original',
	'notes_english',
	'original_version_id',
	'publish_date',
	'release_event_id',
	'song_type',
	'default_name_language',
	'japanese_name',
	'english_name',
	'romaji_name',
] as const;

function SongToString(song: Song): string {
	const value: Record<typeof SongTableColumnNames[number], string> = {
		id: escape(song.id),
		length_seconds: escape(song.lengthSeconds),
		max_milli_bpm: escape(song.maxMilliBpm),
		min_milli_bpm: escape(song.minMilliBpm),
		nico_id: escape(song.nicoId),
		notes_original: escape(song.notesOriginal),
		notes_english: escape(song.notesEnglish),
		original_version_id: escape(song.originalVersionId),
		publish_date: escape(song.publishDate),
		release_event_id: escape(song.releaseEventId),
		song_type: escape(song.songType),
		default_name_language: escape(song.defaultNameLanguage),
		japanese_name: escape(song.japaneseName),
		english_name: escape(song.englishName),
		romaji_name: escape(song.romajiName),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function SongsToString(songs: Song[]): string {
	return `insert into songs (${SongTableColumnNames.join(
		', ',
	)}) value\n${songs.map(SongToString).join(',\n')};`;
}
