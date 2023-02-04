import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { escape } from 'sqlstring';

export interface ArtistForAlbum {
	id: number | undefined;
	artistId: number | undefined;
	albumId: number;
	name: string | undefined;
	isSupport: boolean;
	roles: number;
}

export const ArtistForAlbumTableColumnNames: readonly CamelToSnakeCase<
	keyof ArtistForAlbum
>[] = ['id', 'artist_id', 'album_id', 'name', 'is_support', 'roles'] as const;

function ArtistForAlbumToString(artistForAlbum: ArtistForAlbum): string {
	const value: Record<typeof ArtistForAlbumTableColumnNames[number], string> =
		{
			id: escape(artistForAlbum.id),
			artist_id: escape(artistForAlbum.artistId),
			album_id: escape(artistForAlbum.albumId),
			name: escape(artistForAlbum.name),
			is_support: escape(artistForAlbum.isSupport),
			roles: escape(artistForAlbum.roles),
		};
	return `(${Object.values(value).join(', ')})`;
}

export function ArtistsForAlbumToString(
	artistsForAlbum: ArtistForAlbum[],
): string {
	return `insert into artists_for_albums (${ArtistForAlbumTableColumnNames.join(
		', ',
	)}) value\n${artistsForAlbum.map(ArtistForAlbumToString).join(',\n')};`;
}
