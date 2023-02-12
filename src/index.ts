import { CsvWriter } from '@/CsvWriter';
import { MariaDbSqlGenerator, PostgresSqlGenerator } from '@/SqlGenerator';
import { AlbumTableColumnNames } from '@/entities/Album';
import { AlbumDiscPropertiesTableColumnNames } from '@/entities/AlbumDiscProperties';
import { AlbumIdentifierTableColumnNames } from '@/entities/AlbumIdentifier';
import { ArtistTableColumnNames } from '@/entities/Artist';
import { ArtistForAlbumTableColumnNames } from '@/entities/ArtistForAlbum';
import { ArtistForArtistTableColumnNames } from '@/entities/ArtistForArtist';
import { ArtistForReleaseEventTableColumnNames } from '@/entities/ArtistForReleaseEvent';
import { ArtistForSongTableColumnNames } from '@/entities/ArtistForSong';
import { LyricsForSongTableColumnNames } from '@/entities/LyricsForSong';
import { NameTableColumnNames } from '@/entities/Name';
import { PVTableColumnNames } from '@/entities/PV';
import { PictureFileTableColumnNames } from '@/entities/PictureFile';
import { RelatedTagTableColumnNames } from '@/entities/RelatedTag';
import { ReleaseEventTableColumnNames } from '@/entities/ReleaseEvent';
import { ReleaseEventSeriesTableColumnNames } from '@/entities/ReleaseEventSeries';
import { SongTableColumnNames } from '@/entities/Song';
import { SongInAlbumTableColumnNames } from '@/entities/SongInAlbum';
import { TagTableColumnNames } from '@/entities/Tag';
import { TagUsageTableColumnNames } from '@/entities/TagUsage';
import { WebLinkTableColumnNames } from '@/entities/WebLink';
import {
	loadAlbums,
	loadArtists,
	loadReleaseEventSeries,
	loadReleaseEvents,
	loadSongs,
	loadTags,
} from '@/loadEntries';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const outputPath = resolve(__dirname, '..', 'output');

const sqlGenerators = {
	mariadb: new MariaDbSqlGenerator(outputPath),
	postgres: new PostgresSqlGenerator(outputPath),
} as const;

async function main(): Promise<void> {
	if (!existsSync(outputPath)) {
		await mkdir(outputPath);
	}

	for (const [key, value] of Object.entries(sqlGenerators)) {
		await writeFile(
			resolve(outputPath, `${key}.sql`),
			Array.from(value.generateSql()).join('\n'),
		);
	}

	const csvWriter = new CsvWriter(outputPath);

	const { tags, tagNames, tagWebLinks, relatedTags } = await loadTags();
	await Promise.all([
		csvWriter.write('tags', TagTableColumnNames, tags),
		csvWriter.write('tag_names', NameTableColumnNames, tagNames),
		csvWriter.write('tag_web_links', WebLinkTableColumnNames, tagWebLinks),
		csvWriter.write(
			'related_tags',
			RelatedTagTableColumnNames,
			relatedTags,
		),
	]);

	const {
		artists,
		artistGroups,
		artistNames,
		artistPictureFiles,
		artistTagUsages,
		artistWebLinks,
	} = await loadArtists();
	await Promise.all([
		csvWriter.write('artists', ArtistTableColumnNames, artists),
		csvWriter.write(
			'artists_for_artists',
			ArtistForArtistTableColumnNames,
			artistGroups,
		),
		csvWriter.write('artist_names', NameTableColumnNames, artistNames),
		csvWriter.write(
			'artist_picture_files',
			PictureFileTableColumnNames,
			artistPictureFiles,
		),
		csvWriter.write(
			'artist_tag_usages',
			TagUsageTableColumnNames,
			artistTagUsages,
		),
		csvWriter.write(
			'artist_web_links',
			WebLinkTableColumnNames,
			artistWebLinks,
		),
	]);

	const {
		releaseEventSeries,
		releaseEventSeriesNames,
		releaseEventSeriesTagUsages,
		releaseEventSeriesWebLinks,
	} = await loadReleaseEventSeries();
	await Promise.all([
		csvWriter.write(
			'release_event_series',
			ReleaseEventSeriesTableColumnNames,
			releaseEventSeries,
		),
		csvWriter.write(
			'release_event_series_names',
			NameTableColumnNames,
			releaseEventSeriesNames,
		),
		csvWriter.write(
			'release_event_series_tag_usages',
			TagUsageTableColumnNames,
			releaseEventSeriesTagUsages,
		),
		csvWriter.write(
			'release_event_series_web_links',
			WebLinkTableColumnNames,
			releaseEventSeriesWebLinks,
		),
	]);

	const {
		releaseEvents,
		releaseEventArtists,
		releaseEventNames,
		releaseEventPVs,
		releaseEventTagUsages,
		releaseEventWebLinks,
	} = await loadReleaseEvents();
	await Promise.all([
		csvWriter.write(
			'release_events',
			ReleaseEventTableColumnNames,
			releaseEvents,
		),
		csvWriter.write(
			'artists_for_release_events',
			ArtistForReleaseEventTableColumnNames,
			releaseEventArtists,
		),
		csvWriter.write(
			'release_event_names',
			NameTableColumnNames,
			releaseEventNames,
		),
		csvWriter.write(
			'pvs_for_release_events',
			PVTableColumnNames,
			releaseEventPVs,
		),
		csvWriter.write(
			'release_event_tag_usages',
			TagUsageTableColumnNames,
			releaseEventTagUsages,
		),
		csvWriter.write(
			'release_event_web_links',
			WebLinkTableColumnNames,
			releaseEventWebLinks,
		),
	]);

	const {
		songs,
		songArtists,
		songLyrics,
		songNames,
		songPVs,
		songTagUsages,
		songWebLinks,
	} = await loadSongs();
	await Promise.all([
		csvWriter.write('songs', SongTableColumnNames, songs),
		csvWriter.write(
			'artists_for_songs',
			ArtistForSongTableColumnNames,
			songArtists,
		),
		csvWriter.write(
			'lyrics_for_songs',
			LyricsForSongTableColumnNames,
			songLyrics,
		),
		csvWriter.write('song_names', NameTableColumnNames, songNames),
		csvWriter.write('pvs_for_songs', PVTableColumnNames, songPVs),
		csvWriter.write(
			'song_tag_usages',
			TagUsageTableColumnNames,
			songTagUsages,
		),
		csvWriter.write(
			'song_web_links',
			WebLinkTableColumnNames,
			songWebLinks,
		),
	]);

	const {
		albums,
		albumArtists,
		albumDiscProperties,
		albumIdentifiers,
		albumNames,
		albumPictureFiles,
		albumPVs,
		albumSongs,
		albumTagUsages,
		albumWebLinks,
	} = await loadAlbums();
	await Promise.all([
		csvWriter.write('albums', AlbumTableColumnNames, albums),
		csvWriter.write(
			'artists_for_albums',
			ArtistForAlbumTableColumnNames,
			albumArtists,
		),
		csvWriter.write(
			'album_disc_properties',
			AlbumDiscPropertiesTableColumnNames,
			albumDiscProperties,
		),
		csvWriter.write(
			'album_identifiers',
			AlbumIdentifierTableColumnNames,
			albumIdentifiers,
		),
		csvWriter.write('album_names', NameTableColumnNames, albumNames),
		csvWriter.write(
			'album_picture_files',
			PictureFileTableColumnNames,
			albumPictureFiles,
		),
		csvWriter.write('pvs_for_albums', PVTableColumnNames, albumPVs),
		csvWriter.write(
			'songs_in_albums',
			SongInAlbumTableColumnNames,
			albumSongs,
		),
		csvWriter.write(
			'album_tag_usages',
			TagUsageTableColumnNames,
			albumTagUsages,
		),
		csvWriter.write(
			'album_web_links',
			WebLinkTableColumnNames,
			albumWebLinks,
		),
	]);
}

main();
