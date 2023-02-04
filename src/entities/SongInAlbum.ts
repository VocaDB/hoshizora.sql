import { CamelToSnakeCase } from '@/CamelToSnakeCase';
import { escape } from 'sqlstring';

export interface SongInAlbum {
	id: number | undefined;
	albumId: number;
	discNumber: number;
	name: string | undefined;
	songId: number | undefined;
	trackNumber: number;
}

export const SongInAlbumTableColumnNames: readonly CamelToSnakeCase<
	keyof SongInAlbum
>[] = [
	'id',
	'album_id',
	'disc_number',
	'name',
	'song_id',
	'track_number',
] as const;

function SongInAlbumToString(songInAlbum: SongInAlbum): string {
	const value: Record<typeof SongInAlbumTableColumnNames[number], string> = {
		id: escape(songInAlbum.id),
		album_id: escape(songInAlbum.albumId),
		disc_number: escape(songInAlbum.discNumber),
		name: escape(songInAlbum.name),
		song_id: escape(songInAlbum.songId),
		track_number: escape(songInAlbum.trackNumber),
	};
	return `(${Object.values(value).join(', ')})`;
}

export function SongsInAlbumToString(songsInAlbum: SongInAlbum[]): string {
	return `insert into songs_in_albums (${SongInAlbumTableColumnNames.join(
		', ',
	)}) value\n${songsInAlbum.map(SongInAlbumToString).join(',\n')};`;
}
