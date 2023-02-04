import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { escape } from 'sqlstring';

export interface RelatedTag {
	id: number | undefined;
	ownerTagId: number;
	linkedTagId: number;
}

export const RelatedTagTableColumnNames: readonly CamelToSnakeCase<
	keyof RelatedTag
>[] = ['id', 'owner_tag_id', 'linked_tag_id'] as const;

function RelatedTagToString(relatedTag: RelatedTag): string {
	const value: Record<typeof RelatedTagTableColumnNames[number], string> = {
		id: escape(relatedTag.id),
		owner_tag_id: escape(relatedTag.ownerTagId),
		linked_tag_id: escape(relatedTag.linkedTagId),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function RelatedTagsToString(relatedTags: RelatedTag[]): string {
	return `insert into related_tags (${RelatedTagTableColumnNames.join(
		', ',
	)}) value\n${relatedTags.map(RelatedTagToString).join(',\n')};`;
}
