import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { escape } from 'sqlstring';

export interface ArtistForReleaseEvent {
	id: number | undefined;
	artistId: number | undefined;
	name: string | undefined;
	roles: number;
	releaseEventId: number;
}

export const ArtistForReleaseEventTableColumnNames: readonly CamelToSnakeCase<
	keyof ArtistForReleaseEvent
>[] = ['id', 'artist_id', 'name', 'roles', 'release_event_id'] as const;

function ArtistForReleaseEventToString(
	artistForReleaseEvent: ArtistForReleaseEvent,
): string {
	const value: Record<
		typeof ArtistForReleaseEventTableColumnNames[number],
		string
	> = {
		id: escape(artistForReleaseEvent.id),
		artist_id: escape(artistForReleaseEvent.artistId),
		name: escape(artistForReleaseEvent.name),
		roles: escape(artistForReleaseEvent.roles),
		release_event_id: escape(artistForReleaseEvent.releaseEventId),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function ArtistsForReleaseEventToString(
	artistsForReleaseEvent: ArtistForReleaseEvent[],
): string {
	return `insert into artists_for_release_events (${ArtistForReleaseEventTableColumnNames.join(
		', ',
	)}) value\n${artistsForReleaseEvent
		.map(ArtistForReleaseEventToString)
		.join(',\n')};`;
}
