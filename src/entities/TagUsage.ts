import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { escape } from 'sqlstring';

export interface TagUsage {
	id: number | undefined;
	tagId: number;
	count: number;
}

export const TagUsageTableColumnNames: readonly CamelToSnakeCase<
	keyof TagUsage
>[] = ['id', 'tag_id', 'count'] as const;

function TagUsageToString(tagUsage: TagUsage): string {
	const value: Record<typeof TagUsageTableColumnNames[number], string> = {
		id: escape(tagUsage.id),
		tag_id: escape(tagUsage.tagId),
		count: escape(tagUsage.count),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function TagUsagesToString(
	tableName: string,
	tagUsages: TagUsage[],
): string {
	return `insert into ${tableName} (${TagUsageTableColumnNames.join(
		', ',
	)}) value\n${tagUsages.map(TagUsageToString).join(',\n')};`;
}

export interface AlbumTagUsage extends TagUsage {
	albumId: number;
}

export interface ArtistTagUsage extends TagUsage {
	artistId: number;
}

export interface ReleaseEventSeriesTagUsage extends TagUsage {
	releaseEventSeriesId: number;
}

export interface ReleaseEventTagUsage extends TagUsage {
	releaseEventId: number;
}

export interface SongTagUsage extends TagUsage {
	songId: number;
}
