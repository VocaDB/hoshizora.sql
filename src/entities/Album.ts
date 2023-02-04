import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { TranslatedString } from '@/entities/TranslatedString';
import { escape } from 'sqlstring';

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

export const AlbumTableColumnNames: readonly CamelToSnakeCase<keyof Album>[] = [
	'id',
	'description_original',
	'description_english',
	'disc_type',
	'main_picture_mime',
	'original_release_cat_num',
	'original_release_day',
	'original_release_month',
	'original_release_release_event_id',
	'original_release_year',
	'default_name_language',
	'japanese_name',
	'english_name',
	'romaji_name',
] as const;

function AlbumToString(album: Album): string {
	const value: Record<typeof AlbumTableColumnNames[number], string> = {
		id: escape(album.id),
		description_original: escape(album.descriptionOriginal),
		description_english: escape(album.descriptionEnglish),
		disc_type: escape(album.discType),
		main_picture_mime: escape(album.mainPictureMime),
		original_release_cat_num: escape(album.originalReleaseCatNum),
		original_release_day: escape(album.originalReleaseDay),
		original_release_month: escape(album.originalReleaseMonth),
		original_release_release_event_id: escape(
			album.originalReleaseReleaseEventId,
		),
		original_release_year: escape(album.originalReleaseYear),
		default_name_language: escape(album.defaultNameLanguage),
		japanese_name: escape(album.japaneseName),
		english_name: escape(album.englishName),
		romaji_name: escape(album.romajiName),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function AlbumsToString(albums: Album[]): string {
	return `insert into albums (${AlbumTableColumnNames.join(
		', ',
	)}) value\n${albums.map(AlbumToString).join(',\n')};`;
}
