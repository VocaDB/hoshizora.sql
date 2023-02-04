import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { escape } from 'sqlstring';

export interface AlbumIdentifier {
	id: number | undefined;
	albumId: number;
	value: string;
}

export const AlbumIdentifierTableColumnNames: readonly CamelToSnakeCase<
	keyof AlbumIdentifier
>[] = ['id', 'album_id', 'value'] as const;

function AlbumIdentifierToString(albumIdentifier: AlbumIdentifier): string {
	const value: Record<
		typeof AlbumIdentifierTableColumnNames[number],
		string
	> = {
		id: escape(albumIdentifier.id),
		album_id: escape(albumIdentifier.albumId),
		value: escape(albumIdentifier.value),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function AlbumIdentifiersToString(
	albumIdentifiers: AlbumIdentifier[],
): string {
	return `insert into album_identifiers (${AlbumIdentifierTableColumnNames.join(
		', ',
	)}) value\n${albumIdentifiers.map(AlbumIdentifierToString).join(',\n')};`;
}
