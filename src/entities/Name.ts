import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { escape } from 'sqlstring';

export interface Name {
	id: number | undefined;
	language: string;
	value: string;
}

export const NameTableColumnNames: readonly CamelToSnakeCase<keyof Name>[] = [
	'id',
	'language',
	'value',
] as const;

function NameToString(name: Name): string {
	const value: Record<typeof NameTableColumnNames[number], string> = {
		id: escape(name.id),
		language: escape(name.language),
		value: escape(name.value),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function NamesToString(tableName: string, names: Name[]): string {
	return `insert into ${tableName} (${NameTableColumnNames.join(
		', ',
	)}) value\n${names.map(NameToString).join(',\n')};`;
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
