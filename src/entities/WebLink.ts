import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { escape } from 'sqlstring';

export enum WebLinkCategory {
	Official = 'Official',
	Commercial = 'Commercial',
	Reference = 'Reference',
	Other = 'Other',
}

export interface WebLink {
	id: number | undefined;
	category: WebLinkCategory;
	description: string;
	url: string;
	disabled: boolean;
}

export const WebLinkTableColumnNames: readonly CamelToSnakeCase<
	keyof WebLink
>[] = ['id', 'category', 'description', 'url', 'disabled'] as const;

function WebLinkToString(webLink: WebLink): string {
	const value: Record<typeof WebLinkTableColumnNames[number], string> = {
		id: escape(webLink.id),
		category: escape(webLink.category),
		description: escape(webLink.description),
		url: escape(webLink.url),
		disabled: escape(webLink.disabled),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function WebLinksToString(
	tableName: string,
	webLinks: WebLink[],
): string {
	return `insert into ${tableName} (${WebLinkTableColumnNames.join(
		', ',
	)}) value\n${webLinks.map(WebLinkToString).join(',\n')};`;
}

export interface AlbumWebLink extends WebLink {
	albumId: number;
}

export interface ArtistWebLink extends WebLink {
	artistId: number;
}

export interface ReleaseEventSeriesWebLink extends WebLink {
	releaseEventSeriesId: number;
}

export interface ReleaseEventWebLink extends WebLink {
	releaseEventId: number;
}

export interface SongWebLink extends WebLink {
	songId: number;
}

export interface TagWebLink extends WebLink {
	tagId: number;
}
