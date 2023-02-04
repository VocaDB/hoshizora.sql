import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { escape } from 'sqlstring';

export interface ArtistForSong {
	id: number | undefined;
	artistId: number | undefined;
	name: string | undefined;
	roles: number | undefined;
	songId: number;
	isSupport: boolean;
}

export const ArtistForSongTableColumnNames: readonly CamelToSnakeCase<
	keyof ArtistForSong
>[] = ['id', 'artist_id', 'name', 'roles', 'song_id', 'is_support'] as const;

function ArtistForSongToString(artistForSong: ArtistForSong): string {
	const value: Record<typeof ArtistForSongTableColumnNames[number], string> =
		{
			id: escape(artistForSong.id),
			artist_id: escape(artistForSong.artistId),
			name: escape(artistForSong.name),
			roles: escape(artistForSong.roles),
			song_id: escape(artistForSong.songId),
			is_support: escape(artistForSong.isSupport),
		};
	return `(${Object.values(value).join(', ')})`;
}

export function ArtistsForSongToString(
	artistsForSong: ArtistForSong[],
): string {
	return `insert into artists_for_songs (${ArtistForSongTableColumnNames.join(
		', ',
	)}) value\n${artistsForSong.map(ArtistForSongToString).join(',\n')};`;
}
