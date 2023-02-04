import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { ReleaseEventCategory } from '@/entities/ReleaseEvent';
import { TranslatedString } from '@/entities/TranslatedString';
import { escape } from 'sqlstring';

export interface ReleaseEventSeries extends TranslatedString {
	id: number;
	category: ReleaseEventCategory;
	description: string;
	mainPictureMime: string | undefined;
}

export const ReleaseEventSeriesTableColumnNames: readonly CamelToSnakeCase<
	keyof ReleaseEventSeries
>[] = [
	'id',
	'category',
	'description',
	'main_picture_mime',
	'default_name_language',
	'japanese_name',
	'english_name',
	'romaji_name',
] as const;

function ReleaseEventSeriesToString(
	releaseEventSeries: ReleaseEventSeries,
): string {
	const value: Record<
		typeof ReleaseEventSeriesTableColumnNames[number],
		string
	> = {
		id: escape(releaseEventSeries.id),
		category: escape(releaseEventSeries.category),
		description: escape(releaseEventSeries.description),
		main_picture_mime: escape(releaseEventSeries.mainPictureMime),
		default_name_language: escape(releaseEventSeries.defaultNameLanguage),
		japanese_name: escape(releaseEventSeries.japaneseName),
		english_name: escape(releaseEventSeries.englishName),
		romaji_name: escape(releaseEventSeries.romajiName),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function ReleaseEventSeriesListToString(
	releaseEventSeries: ReleaseEventSeries[],
): string {
	return `insert into release_event_series (${ReleaseEventSeriesTableColumnNames.join(
		', ',
	)}) value\n${releaseEventSeries
		.map(ReleaseEventSeriesToString)
		.join(',\n')};`;
}
