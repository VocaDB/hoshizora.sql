import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { TranslatedString } from '@/entities/TranslatedString';
import { escape } from 'sqlstring';

export interface Tag extends TranslatedString {
	id: number;
	categoryName: string;
	descriptionOriginal: string;
	descriptionEnglish: string;
	hideFromSuggestions: boolean;
	parentId: number | undefined;
	targets: number;
	thumbMime: string | undefined;
}

export const TagTableColumnNames: readonly CamelToSnakeCase<keyof Tag>[] = [
	'id',
	'category_name',
	'description_original',
	'description_english',
	'hide_from_suggestions',
	'parent_id',
	'default_name_language',
	'japanese_name',
	'english_name',
	'romaji_name',
	'targets',
	'thumb_mime',
] as const;

function TagToString(tag: Tag): string {
	const value: Record<typeof TagTableColumnNames[number], string> = {
		id: escape(tag.id),
		category_name: escape(tag.categoryName),
		description_original: escape(tag.descriptionOriginal),
		description_english: escape(tag.descriptionEnglish),
		hide_from_suggestions: escape(tag.hideFromSuggestions),
		parent_id: escape(tag.parentId),
		default_name_language: escape(tag.defaultNameLanguage),
		japanese_name: escape(tag.japaneseName),
		english_name: escape(tag.englishName),
		romaji_name: escape(tag.romajiName),
		targets: escape(tag.targets),
		thumb_mime: escape(tag.thumbMime),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function TagsToString(tags: Tag[]): string {
	return `insert into tags (${TagTableColumnNames.join(', ')}) values\n${tags
		.map(TagToString)
		.join(',\n')};`;
}
