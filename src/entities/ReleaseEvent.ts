import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { TranslatedString } from '@/entities/TranslatedString';
import { escape } from 'sqlstring';

export enum ReleaseEventCategory {
	'Unspecified' = 'Unspecified',
	'AlbumRelease' = 'AlbumRelease',
	'Anniversary' = 'Anniversary',
	'Club' = 'Club',
	'Concert' = 'Concert',
	'Contest' = 'Contest',
	'Convention' = 'Convention',
	'Other' = 'Other',
	'Festival' = 'Festival',
}

export interface ReleaseEvent extends TranslatedString {
	id: number;
	category: ReleaseEventCategory;
	date: Date | undefined;
	description: string;
	mainPictureMime: string | undefined;
	seriesId: number | undefined;
	seriesNumber: number;
	venueName: string | undefined;
}

export const ReleaseEventTableColumnNames: readonly CamelToSnakeCase<
	keyof ReleaseEvent
>[] = [
	'id',
	'category',
	'date',
	'description',
	'main_picture_mime',
	'series_id',
	'series_number',
	'venue_name',
	'default_name_language',
	'japanese_name',
	'english_name',
	'romaji_name',
] as const;

function ReleaseEventToString(releaseEvent: ReleaseEvent): string {
	const value: Record<typeof ReleaseEventTableColumnNames[number], string> = {
		id: escape(releaseEvent.id),
		category: escape(releaseEvent.category),
		date: escape(releaseEvent.date),
		description: escape(releaseEvent.description),
		main_picture_mime: escape(releaseEvent.mainPictureMime),
		series_id: escape(releaseEvent.seriesId),
		series_number: escape(releaseEvent.seriesNumber),
		venue_name: escape(releaseEvent.venueName),
		default_name_language: escape(releaseEvent.defaultNameLanguage),
		japanese_name: escape(releaseEvent.japaneseName),
		english_name: escape(releaseEvent.englishName),
		romaji_name: escape(releaseEvent.romajiName),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function ReleaseEventsToString(releaseEvents: ReleaseEvent[]): string {
	return `insert into release_events (${ReleaseEventTableColumnNames.join(
		', ',
	)}) value\n${releaseEvents.map(ReleaseEventToString).join(',\n')};`;
}
