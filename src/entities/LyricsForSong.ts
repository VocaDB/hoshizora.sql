import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { escape } from 'sqlstring';

export enum TranslationType {
	Original = 'Original',
	Romanized = 'Romanized',
	Translation = 'Translation',
}

export interface LyricsForSong {
	id: number | undefined;
	songId: number;
	source: string;
	text: string;
	cultureCode: string;
	translationType: TranslationType;
	url: string;
}

export const LyricsForSongTableColumnNames: readonly CamelToSnakeCase<
	keyof LyricsForSong
>[] = [
	'id',
	'song_id',
	'source',
	'text',
	'culture_code',
	'translation_type',
	'url',
] as const;

function LyricsForSongToString(lyricsForSong: LyricsForSong): string {
	const value: Record<typeof LyricsForSongTableColumnNames[number], string> =
		{
			id: escape(lyricsForSong.id),
			song_id: escape(lyricsForSong.songId),
			source: escape(lyricsForSong.source),
			text: escape(lyricsForSong.text),
			culture_code: escape(lyricsForSong.cultureCode),
			translation_type: escape(lyricsForSong.translationType),
			url: escape(lyricsForSong.url),
		};
	return `(${Object.values(value).join(', ')})`;
}

export function LyricsListForSongToString(
	lyricsListForSong: LyricsForSong[],
): string {
	return `insert into lyrics_for_songs (${LyricsForSongTableColumnNames.join(
		', ',
	)}) value\n${lyricsListForSong.map(LyricsForSongToString).join(',\n')};`;
}
