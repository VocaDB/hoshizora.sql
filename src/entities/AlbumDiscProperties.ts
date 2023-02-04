import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { escape } from 'sqlstring';

export enum DiscMediaType {
	Audio = 'Audio',
	Video = 'Video',
}

export interface AlbumDiscProperties {
	id: number | undefined;
	albumId: number;
	discNumber: number;
	mediaType: DiscMediaType;
	name: string;
}

export const AlbumDiscPropertiesTableColumnNames: readonly CamelToSnakeCase<
	keyof AlbumDiscProperties
>[] = ['id', 'album_id', 'disc_number', 'media_type', 'name'] as const;

function AlbumDiscPropertiesToString(
	albumDiscProperties: AlbumDiscProperties,
): string {
	const value: Record<
		typeof AlbumDiscPropertiesTableColumnNames[number],
		string
	> = {
		id: escape(albumDiscProperties.id),
		album_id: escape(albumDiscProperties.albumId),
		disc_number: escape(albumDiscProperties.discNumber),
		media_type: escape(albumDiscProperties.mediaType),
		name: escape(albumDiscProperties.name),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function AlbumDiscPropertiesListToString(
	albumDiscProperties: AlbumDiscProperties[],
): string {
	return `insert into album_disc_properties (${AlbumDiscPropertiesTableColumnNames.join(
		', ',
	)}) value\n${albumDiscProperties
		.map(AlbumDiscPropertiesToString)
		.join(',\n')};`;
}
