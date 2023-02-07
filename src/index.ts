import { TableName, TableNames } from '@/TableNames';
import { Album, AlbumTableColumnNames } from '@/entities/Album';
import {
	AlbumDiscProperties,
	AlbumDiscPropertiesTableColumnNames,
} from '@/entities/AlbumDiscProperties';
import {
	AlbumIdentifier,
	AlbumIdentifierTableColumnNames,
} from '@/entities/AlbumIdentifier';
import { Artist, ArtistTableColumnNames } from '@/entities/Artist';
import {
	ArtistForAlbum,
	ArtistForAlbumTableColumnNames,
} from '@/entities/ArtistForAlbum';
import {
	ArtistForArtist,
	ArtistForArtistTableColumnNames,
} from '@/entities/ArtistForArtist';
import {
	ArtistForReleaseEvent,
	ArtistForReleaseEventTableColumnNames,
} from '@/entities/ArtistForReleaseEvent';
import {
	ArtistForSong,
	ArtistForSongTableColumnNames,
} from '@/entities/ArtistForSong';
import {
	LyricsForSong,
	LyricsForSongTableColumnNames,
} from '@/entities/LyricsForSong';
import {
	AlbumName,
	ArtistName,
	NameTableColumnNames,
	ReleaseEventName,
	ReleaseEventSeriesName,
	SongName,
	TagName,
} from '@/entities/Name';
import {
	PVForAlbum,
	PVForReleaseEvent,
	PVForSong,
	PVTableColumnNames,
} from '@/entities/PV';
import {
	AlbumPictureFile,
	ArtistPictureFile,
	PictureFileTableColumnNames,
} from '@/entities/PictureFile';
import { RelatedTag, RelatedTagTableColumnNames } from '@/entities/RelatedTag';
import {
	ReleaseEvent,
	ReleaseEventTableColumnNames,
} from '@/entities/ReleaseEvent';
import {
	ReleaseEventSeries,
	ReleaseEventSeriesTableColumnNames,
} from '@/entities/ReleaseEventSeries';
import { Song, SongTableColumnNames } from '@/entities/Song';
import {
	SongInAlbum,
	SongInAlbumTableColumnNames,
} from '@/entities/SongInAlbum';
import { Tag, TagTableColumnNames } from '@/entities/Tag';
import {
	AlbumTagUsage,
	ArtistTagUsage,
	ReleaseEventSeriesTagUsage,
	ReleaseEventTagUsage,
	SongTagUsage,
	TagUsageTableColumnNames,
} from '@/entities/TagUsage';
import {
	AlbumWebLink,
	ArtistWebLink,
	ReleaseEventSeriesWebLink,
	ReleaseEventWebLink,
	SongWebLink,
	TagWebLink,
	WebLinkTableColumnNames,
} from '@/entities/WebLink';
import { ArchivedAlbumContract } from '@/models/ArchivedAlbumContract';
import { ArchivedArtistContract } from '@/models/ArchivedArtistContract';
import { ArchivedReleaseEventContract } from '@/models/ArchivedReleaseEventContract';
import { ArchivedReleaseEventSeriesContract } from '@/models/ArchivedReleaseEventSeriesContract';
import { ArchivedSongContract } from '@/models/ArchivedSongContract';
import { ArchivedTagContract } from '@/models/ArchivedTagContract';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { escape } from 'sqlstring';

const dumpPath = resolve(__dirname, '..', 'dump');
const outputPath = resolve(__dirname, '..', 'output');

type ArchivedEntry =
	| ArchivedAlbumContract
	| ArchivedArtistContract
	| ArchivedReleaseEventContract
	| ArchivedReleaseEventSeriesContract
	| ArchivedSongContract
	| ArchivedTagContract;

async function* loadEntries<TArchivedEntry extends ArchivedEntry>(
	folder: 'Albums' | 'Artists' | 'Events' | 'EventSeries' | 'Songs' | 'Tags',
): AsyncGenerator<TArchivedEntry> {
	const folderPath = resolve(dumpPath, folder);
	const fileNames = (await readdir(folderPath)).sort(
		(a, b) => a.length - b.length,
	);

	for (const fileName of fileNames) {
		const jsonPath = resolve(folderPath, fileName);
		console.log(`Reading from ${jsonPath}...`);

		// TODO: Validate JSON.
		const archivedEntries = JSON.parse(
			await readFile(jsonPath, 'utf8'),
		) as TArchivedEntry[];

		for (const archived of archivedEntries) {
			yield archived;
		}
	}
}

async function convertArchivedTags(): Promise<{
	tags: Tag[];
	tagNames: TagName[];
	tagWebLinks: TagWebLink[];
	relatedTags: RelatedTag[];
}> {
	const tags: Tag[] = [];
	const tagNames: TagName[] = [];
	const tagWebLinks: TagWebLink[] = [];
	const relatedTags: RelatedTag[] = [];

	for await (const archived of loadEntries<ArchivedTagContract>('Tags')) {
		tags.push({
			id: archived.id,
			categoryName: archived.categoryName,
			descriptionEnglish: archived.descriptionEng ?? '',
			descriptionOriginal: archived.description ?? '',
			hideFromSuggestions: archived.hideFromSuggestions,
			parentId: archived.parent?.id,
			defaultNameLanguage: archived.translatedName.defaultLanguage,
			japaneseName: archived.translatedName.japanese,
			englishName: archived.translatedName.english,
			romajiName: archived.translatedName.romaji,
			targets: archived.targets,
			thumbMime: archived.thumbMime,
		});

		if (archived.names) {
			for (const name of archived.names) {
				tagNames.push({
					id: undefined,
					language: name.language,
					value: name.value,
					tagId: archived.id,
				});
			}
		}

		if (archived.webLinks) {
			for (const webLink of archived.webLinks) {
				tagWebLinks.push({
					id: undefined,
					category: webLink.category,
					description: webLink.description,
					url: webLink.url,
					disabled: webLink.disabled,
					tagId: archived.id,
				});
			}
		}

		if (archived.relatedTags) {
			for (const relatedTag of archived.relatedTags) {
				relatedTags.push({
					id: undefined,
					ownerTagId: archived.id,
					linkedTagId: relatedTag.id,
				});
			}
		}
	}

	return { tags, tagNames, tagWebLinks, relatedTags };
}

async function convertArchivedArtists(): Promise<{
	artists: Artist[];
	artistGroups: ArtistForArtist[];
	artistNames: ArtistName[];
	artistPictureFiles: ArtistPictureFile[];
	artistTagUsages: ArtistTagUsage[];
	artistWebLinks: ArtistWebLink[];
}> {
	const artists: Artist[] = [];
	const artistGroups: ArtistForArtist[] = [];
	const artistNames: ArtistName[] = [];
	const artistPictureFiles: ArtistPictureFile[] = [];
	const artistTagUsages: ArtistTagUsage[] = [];
	const artistWebLinks: ArtistWebLink[] = [];

	for await (const archived of loadEntries<ArchivedArtistContract>(
		'Artists',
	)) {
		artists.push({
			id: archived.id,
			artistType: archived.artistType,
			baseVoicebankId: archived.baseVoicebank?.id,
			descriptionOriginal: archived.description ?? '',
			descriptionEnglish: archived.descriptionEng ?? '',
			mainPictureMime: archived.mainPictureMime,
			releaseDate: archived.releaseDate
				? new Date(archived.releaseDate)
				: undefined,
			defaultNameLanguage: archived.translatedName.defaultLanguage,
			japaneseName: archived.translatedName.japanese,
			englishName: archived.translatedName.english,
			romajiName: archived.translatedName.romaji,
		});

		if (archived.groups) {
			for (const group of archived.groups) {
				artistGroups.push({
					id: undefined,
					groupId: group.id,
					memberId: archived.id,
					linkType: group.linkType,
				});
			}
		}

		if (archived.names) {
			for (const name of archived.names) {
				artistNames.push({
					id: undefined,
					language: name.language,
					value: name.value,
					artistId: archived.id,
				});
			}
		}

		if (archived.pictures) {
			for (const picture of archived.pictures) {
				artistPictureFiles.push({
					id: undefined,
					created: new Date(picture.created),
					mime: picture.mime,
					name: picture.name,
					artistId: archived.id,
				});
			}
		}

		if (archived.tags) {
			for (const tag of archived.tags) {
				artistTagUsages.push({
					id: undefined,
					tagId: tag.tag.id,
					count: tag.count,
					artistId: archived.id,
				});
			}
		}

		if (archived.webLinks) {
			for (const webLink of archived.webLinks) {
				artistWebLinks.push({
					id: undefined,
					category: webLink.category,
					description: webLink.description,
					url: webLink.url,
					disabled: webLink.disabled,
					artistId: archived.id,
				});
			}
		}
	}

	return {
		artists,
		artistGroups,
		artistNames,
		artistPictureFiles,
		artistTagUsages,
		artistWebLinks,
	};
}

async function convertArchivedReleaseEventSeries(): Promise<{
	releaseEventSeries: ReleaseEventSeries[];
	releaseEventSeriesNames: ReleaseEventSeriesName[];
	releaseEventSeriesTagUsages: ReleaseEventSeriesTagUsage[];
	releaseEventSeriesWebLinks: ReleaseEventSeriesWebLink[];
}> {
	const releaseEventSeries: ReleaseEventSeries[] = [];
	const releaseEventSeriesNames: ReleaseEventSeriesName[] = [];
	const releaseEventSeriesTagUsages: ReleaseEventSeriesTagUsage[] = [];
	const releaseEventSeriesWebLinks: ReleaseEventSeriesWebLink[] = [];

	for await (const archived of loadEntries<ArchivedReleaseEventSeriesContract>(
		'EventSeries',
	)) {
		releaseEventSeries.push({
			id: archived.id,
			category: archived.category,
			description: archived.description,
			mainPictureMime: archived.mainPictureMime,
			defaultNameLanguage: archived.translatedName.defaultLanguage,
			japaneseName: archived.translatedName.japanese,
			englishName: archived.translatedName.english,
			romajiName: archived.translatedName.romaji,
		});

		if (archived.names) {
			for (const name of archived.names) {
				releaseEventSeriesNames.push({
					id: undefined,
					language: name.language,
					value: name.value,
					releaseEventSeriesId: archived.id,
				});
			}
		}

		if (archived.tags) {
			for (const tag of archived.tags) {
				releaseEventSeriesTagUsages.push({
					id: undefined,
					tagId: tag.tag.id,
					count: tag.count,
					releaseEventSeriesId: archived.id,
				});
			}
		}

		if (archived.webLinks) {
			for (const webLink of archived.webLinks) {
				releaseEventSeriesWebLinks.push({
					id: undefined,
					category: webLink.category,
					description: webLink.description,
					url: webLink.url,
					disabled: webLink.disabled,
					releaseEventSeriesId: archived.id,
				});
			}
		}
	}

	return {
		releaseEventSeries,
		releaseEventSeriesNames,
		releaseEventSeriesTagUsages,
		releaseEventSeriesWebLinks,
	};
}

async function convertArchivedReleaseEvents(): Promise<{
	releaseEvents: ReleaseEvent[];
	releaseEventArtists: ArtistForReleaseEvent[];
	releaseEventNames: ReleaseEventName[];
	releaseEventPVs: PVForReleaseEvent[];
	releaseEventTagUsages: ReleaseEventTagUsage[];
	releaseEventWebLinks: ReleaseEventWebLink[];
}> {
	const releaseEvents: ReleaseEvent[] = [];
	const releaseEventArtists: ArtistForReleaseEvent[] = [];
	const releaseEventNames: ReleaseEventName[] = [];
	const releaseEventPVs: PVForReleaseEvent[] = [];
	const releaseEventTagUsages: ReleaseEventTagUsage[] = [];
	const releaseEventWebLinks: ReleaseEventWebLink[] = [];

	for await (const archived of loadEntries<ArchivedReleaseEventContract>(
		'Events',
	)) {
		releaseEvents.push({
			id: archived.id,
			category: archived.category,
			date: archived.date ? new Date(archived.date) : undefined,
			description: archived.description,
			mainPictureMime: archived.mainPictureMime,
			seriesId: archived.series?.id,
			seriesNumber: archived.seriesNumber,
			defaultNameLanguage: archived.translatedName.defaultLanguage,
			japaneseName: archived.translatedName.japanese,
			englishName: archived.translatedName.english,
			romajiName: archived.translatedName.romaji,
			venueName: archived.venueName,
		});

		if (archived.artists) {
			for (const artist of archived.artists) {
				releaseEventArtists.push({
					id: undefined,
					artistId: artist.id,
					name: artist.nameHint,
					roles: artist.roles,
					releaseEventId: archived.id,
				});
			}
		}

		if (archived.names) {
			for (const name of archived.names) {
				releaseEventNames.push({
					id: undefined,
					language: name.language,
					value: name.value,
					releaseEventId: archived.id,
				});
			}
		}

		if (archived.pvs) {
			for (const pv of archived.pvs) {
				releaseEventPVs.push({
					id: undefined,
					author: pv.author,
					name: pv.name,
					pvId: pv.pvId,
					pvType: pv.pvType,
					service: pv.service,
					extendedMetadata: JSON.stringify(pv.extendedMetadata),
					publishDate: pv.publishDate
						? new Date(pv.publishDate)
						: undefined,
					releaseEventId: archived.id,
				});
			}
		}

		if (archived.tags) {
			for (const tag of archived.tags) {
				releaseEventTagUsages.push({
					id: undefined,
					tagId: tag.tag.id,
					count: tag.count,
					releaseEventId: archived.id,
				});
			}
		}

		if (archived.webLinks) {
			for (const webLink of archived.webLinks) {
				releaseEventWebLinks.push({
					id: undefined,
					category: webLink.category,
					description: webLink.description,
					url: webLink.url,
					disabled: webLink.disabled,
					releaseEventId: archived.id,
				});
			}
		}
	}

	return {
		releaseEvents,
		releaseEventArtists,
		releaseEventNames,
		releaseEventPVs,
		releaseEventTagUsages,
		releaseEventWebLinks,
	};
}

async function convertArchivedSongs(): Promise<{
	songs: Song[];
	songArtists: ArtistForSong[];
	songLyrics: LyricsForSong[];
	songNames: SongName[];
	songPVs: PVForSong[];
	songTagUsages: SongTagUsage[];
	songWebLinks: SongWebLink[];
}> {
	const songs: Song[] = [];
	const songArtists: ArtistForSong[] = [];
	const songLyrics: LyricsForSong[] = [];
	const songNames: SongName[] = [];
	const songPVs: PVForSong[] = [];
	const songTagUsages: SongTagUsage[] = [];
	const songWebLinks: SongWebLink[] = [];

	for await (const archived of loadEntries<ArchivedSongContract>('Songs')) {
		songs.push({
			id: archived.id,
			lengthSeconds: archived.lengthSeconds,
			maxMilliBpm: archived.maxMilliBpm,
			minMilliBpm: archived.minMilliBpm,
			nicoId: archived.nicoId,
			notesOriginal: archived.notes,
			notesEnglish: archived.notesEng,
			originalVersionId: archived.originalVersion?.id,
			publishDate: archived.publishDate
				? new Date(archived.publishDate)
				: undefined,
			releaseEventId: archived.releaseEvent?.id,
			songType: archived.songType,
			defaultNameLanguage: archived.translatedName.defaultLanguage,
			japaneseName: archived.translatedName.japanese,
			englishName: archived.translatedName.english,
			romajiName: archived.translatedName.romaji,
		});

		if (archived.artists) {
			for (const artist of archived.artists) {
				songArtists.push({
					id: undefined,
					artistId: artist.id,
					name: artist.nameHint,
					roles: artist.roles,
					songId: archived.id,
					isSupport: artist.isSupport,
				});
			}
		}

		if (archived.lyrics) {
			for (const lyrics of archived.lyrics) {
				songLyrics.push({
					id: undefined,
					songId: archived.id,
					source: lyrics.source,
					text: lyrics.value ?? '',
					cultureCode: lyrics.cultureCode,
					translationType: lyrics.translationType,
					url: lyrics.url,
				});
			}
		}

		if (archived.names) {
			for (const name of archived.names) {
				songNames.push({
					id: undefined,
					language: name.language,
					value: name.value,
					songId: archived.id,
				});
			}
		}

		if (archived.pvs) {
			for (const pv of archived.pvs) {
				songPVs.push({
					id: undefined,
					author: pv.author,
					name: pv.name,
					pvId: pv.pvId,
					pvType: pv.pvType,
					service: pv.service,
					extendedMetadata: JSON.stringify(pv.extendedMetadata),
					publishDate: pv.publishDate
						? new Date(pv.publishDate)
						: undefined,
					songId: archived.id,
				});
			}
		}

		if (archived.tags) {
			for (const tag of archived.tags) {
				songTagUsages.push({
					id: undefined,
					tagId: tag.tag.id,
					count: tag.count,
					songId: archived.id,
				});
			}
		}

		if (archived.webLinks) {
			for (const webLink of archived.webLinks) {
				songWebLinks.push({
					id: undefined,
					category: webLink.category,
					description: webLink.description,
					url: webLink.url,
					disabled: webLink.disabled,
					songId: archived.id,
				});
			}
		}
	}

	return {
		songs,
		songArtists,
		songLyrics,
		songNames,
		songPVs,
		songTagUsages,
		songWebLinks,
	};
}

async function convertArchivedAlbums(): Promise<{
	albums: Album[];
	albumArtists: ArtistForAlbum[];
	albumDiscProperties: AlbumDiscProperties[];
	albumIdentifiers: AlbumIdentifier[];
	albumNames: AlbumName[];
	albumPictureFiles: AlbumPictureFile[];
	albumPVs: PVForAlbum[];
	albumSongs: SongInAlbum[];
	albumTagUsages: AlbumTagUsage[];
	albumWebLinks: AlbumWebLink[];
}> {
	const albums: Album[] = [];
	const albumArtists: ArtistForAlbum[] = [];
	const albumDiscProperties: AlbumDiscProperties[] = [];
	const albumIdentifiers: AlbumIdentifier[] = [];
	const albumNames: AlbumName[] = [];
	const albumPictureFiles: AlbumPictureFile[] = [];
	const albumPVs: PVForAlbum[] = [];
	const albumSongs: SongInAlbum[] = [];
	const albumTagUsages: AlbumTagUsage[] = [];
	const albumWebLinks: AlbumWebLink[] = [];

	for await (const archived of loadEntries<ArchivedAlbumContract>('Albums')) {
		albums.push({
			id: archived.id,
			descriptionOriginal: archived.description ?? '',
			descriptionEnglish: archived.descriptionEng ?? '',
			discType: archived.discType,
			mainPictureMime: archived.mainPictureMime,
			originalReleaseCatNum: archived.originalRelease?.catNum,
			originalReleaseDay: archived.originalRelease?.releaseDate?.day,
			originalReleaseMonth: archived.originalRelease?.releaseDate?.month,
			originalReleaseReleaseEventId:
				archived.originalRelease?.releaseEvent?.id,
			originalReleaseYear: archived.originalRelease?.releaseDate?.year,
			defaultNameLanguage: archived.translatedName.defaultLanguage,
			japaneseName: archived.translatedName.japanese,
			englishName: archived.translatedName.english,
			romajiName: archived.translatedName.romaji,
		});

		if (archived.artists) {
			for (const artist of archived.artists) {
				albumArtists.push({
					id: undefined,
					artistId: artist.id,
					albumId: archived.id,
					name: artist.nameHint,
					isSupport: artist.isSupport,
					roles: artist.roles,
				});
			}
		}

		if (archived.discs) {
			for (const disc of archived.discs) {
				albumDiscProperties.push({
					id: undefined,
					albumId: archived.id,
					discNumber: disc.discNumber,
					mediaType: disc.mediaType,
					name: disc.name,
				});
			}
		}

		if (archived.identifiers) {
			for (const identifier of archived.identifiers) {
				albumIdentifiers.push({
					id: undefined,
					albumId: archived.id,
					value: identifier.value,
				});
			}
		}

		if (archived.names) {
			for (const name of archived.names) {
				albumNames.push({
					id: undefined,
					language: name.language,
					value: name.value,
					albumId: archived.id,
				});
			}
		}

		if (archived.pictures) {
			for (const picture of archived.pictures) {
				albumPictureFiles.push({
					id: undefined,
					created: new Date(picture.created),
					mime: picture.mime,
					name: picture.name,
					albumId: archived.id,
				});
			}
		}

		if (archived.pvs) {
			for (const pv of archived.pvs) {
				albumPVs.push({
					id: undefined,
					author: pv.author,
					name: pv.name,
					pvId: pv.pvId,
					pvType: pv.pvType,
					service: pv.service,
					extendedMetadata: JSON.stringify(pv.extendedMetadata),
					publishDate: pv.publishDate
						? new Date(pv.publishDate)
						: undefined,
					albumId: archived.id,
				});
			}
		}

		if (archived.songs) {
			for (const song of archived.songs) {
				albumSongs.push({
					id: undefined,
					albumId: archived.id,
					discNumber: song.discNumber,
					name: song.nameHint,
					songId: song.id,
					trackNumber: song.trackNumber,
				});
			}
		}

		if (archived.tags) {
			for (const tag of archived.tags) {
				albumTagUsages.push({
					id: undefined,
					tagId: tag.tag.id,
					count: tag.count,
					albumId: archived.id,
				});
			}
		}

		if (archived.webLinks) {
			for (const webLink of archived.webLinks) {
				albumWebLinks.push({
					id: undefined,
					category: webLink.category,
					description: webLink.description,
					url: webLink.url,
					disabled: webLink.disabled,
					albumId: archived.id,
				});
			}
		}
	}

	return {
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
	};
}

function* generateSql(): Generator<string> {
	for (const tableName of TableNames) {
		yield `drop table if exists \`${tableName}\`;`;
	}

	yield "create table `artists` (`id` int unsigned not null auto_increment primary key, `artist_type` enum('Unknown', 'Circle', 'Label', 'Producer', 'Animator', 'Illustrator', 'Lyricist', 'Vocaloid', 'UTAU', 'CeVIO', 'OtherVoiceSynthesizer', 'OtherVocalist', 'OtherGroup', 'OtherIndividual', 'Utaite', 'Band', 'Vocalist', 'Character', 'SynthesizerV', 'CoverArtist') not null, `base_voicebank_id` int unsigned null, `description_original` text not null, `description_english` text not null, `main_picture_mime` varchar(32) null, `release_date` datetime null, `default_name_language` enum('Unspecified', 'Japanese', 'Romaji', 'English') not null, `japanese_name` varchar(255) not null, `english_name` varchar(255) not null, `romaji_name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;";
	yield "create table `artists_for_artists` (`id` int unsigned not null auto_increment primary key, `group_id` int unsigned not null, `member_id` int unsigned not null, `link_type` enum('CharacterDesigner', 'Group', 'Illustrator', 'Manager', 'VoiceProvider') not null) default character set utf8mb4 engine = InnoDB;";
	yield 'create table `artist_names` (`id` int unsigned not null auto_increment primary key, `language` varchar(16) not null, `value` varchar(255) not null, `artist_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;';
	yield 'create table `artist_picture_files` (`id` int unsigned not null auto_increment primary key, `created` datetime not null, `mime` varchar(32) not null, `name` varchar(200) not null, `artist_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;';
	yield "create table `artist_web_links` (`id` int unsigned not null auto_increment primary key, `category` enum('Official', 'Commercial', 'Reference', 'Other') not null, `description` varchar(512) not null, `url` varchar(512) not null, `disabled` tinyint(1) not null, `artist_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;";
	yield "create table `release_event_series` (`id` int unsigned not null auto_increment primary key, `category` enum('Unspecified', 'AlbumRelease', 'Anniversary', 'Club', 'Concert', 'Contest', 'Convention', 'Other', 'Festival') not null, `description` text not null, `main_picture_mime` varchar(32) null, `default_name_language` enum('Unspecified', 'Japanese', 'Romaji', 'English') not null, `japanese_name` varchar(255) not null, `english_name` varchar(255) not null, `romaji_name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;";
	yield "create table `release_events` (`id` int unsigned not null auto_increment primary key, `category` enum('Unspecified', 'AlbumRelease', 'Anniversary', 'Club', 'Concert', 'Contest', 'Convention', 'Other', 'Festival') not null, `date` datetime null, `description` text not null, `main_picture_mime` varchar(32) null, `series_id` int unsigned null, `series_number` int not null, `default_name_language` enum('Unspecified', 'Japanese', 'Romaji', 'English') not null, `japanese_name` varchar(255) not null, `english_name` varchar(255) not null, `romaji_name` varchar(255) not null, `venue_name` varchar(1000) null) default character set utf8mb4 engine = InnoDB;";
	yield 'create table `release_event_names` (`id` int unsigned not null auto_increment primary key, `language` varchar(16) not null, `value` varchar(255) not null, `release_event_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;';
	yield "create table `pvs_for_release_events` (`id` int unsigned not null auto_increment primary key, `author` varchar(100) not null, `name` varchar(200) not null, `pv_id` varchar(255) not null, `pv_type` enum('Original', 'Reprint', 'Other') not null, `service` enum('NicoNicoDouga', 'Youtube', 'SoundCloud', 'Vimeo', 'Piapro', 'Bilibili', 'File', 'LocalFile', 'Creofuga', 'Bandcamp') not null, `extended_metadata` json null, `publish_date` datetime null, `release_event_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;";
	yield 'create table `artists_for_release_events` (`id` int unsigned not null auto_increment primary key, `artist_id` int unsigned null, `name` varchar(255) null, `roles` int not null, `release_event_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;';
	yield "create table `albums` (`id` int unsigned not null auto_increment primary key, `description_original` text not null, `description_english` text not null, `disc_type` enum('Unknown', 'Album', 'Single', 'EP', 'SplitAlbum', 'Compilation', 'Video', 'Artbook', 'Game', 'Fanmade', 'Instrumental', 'Other') not null, `main_picture_mime` varchar(32) null, `original_release_cat_num` varchar(50) null, `original_release_day` int null, `original_release_month` int null, `original_release_release_event_id` int unsigned null, `original_release_year` int null, `default_name_language` enum('Unspecified', 'Japanese', 'Romaji', 'English') not null, `japanese_name` varchar(255) not null, `english_name` varchar(255) not null, `romaji_name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;";
	yield "create table `pvs_for_albums` (`id` int unsigned not null auto_increment primary key, `author` varchar(100) not null, `name` varchar(200) not null, `pv_id` varchar(255) not null, `pv_type` enum('Original', 'Reprint', 'Other') not null, `service` enum('NicoNicoDouga', 'Youtube', 'SoundCloud', 'Vimeo', 'Piapro', 'Bilibili', 'File', 'LocalFile', 'Creofuga', 'Bandcamp') not null, `extended_metadata` json null, `publish_date` datetime null, `album_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;";
	yield 'create table `artists_for_albums` (`id` int unsigned not null auto_increment primary key, `artist_id` int unsigned null, `album_id` int unsigned not null, `name` varchar(255) null, `is_support` tinyint(1) not null, `roles` int not null) default character set utf8mb4 engine = InnoDB;';
	yield "create table `album_web_links` (`id` int unsigned not null auto_increment primary key, `category` enum('Official', 'Commercial', 'Reference', 'Other') not null, `description` varchar(512) not null, `url` varchar(512) not null, `disabled` tinyint(1) not null, `album_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;";
	yield 'create table `album_picture_files` (`id` int unsigned not null auto_increment primary key, `created` datetime not null, `mime` varchar(32) not null, `name` varchar(200) not null, `album_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;';
	yield 'create table `album_names` (`id` int unsigned not null auto_increment primary key, `language` varchar(16) not null, `value` varchar(255) not null, `album_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;';
	yield 'create table `album_identifiers` (`id` int unsigned not null auto_increment primary key, `album_id` int unsigned not null, `value` varchar(50) not null) default character set utf8mb4 engine = InnoDB;';
	yield "create table `album_disc_properties` (`id` int unsigned not null auto_increment primary key, `album_id` int unsigned not null, `disc_number` int not null, `media_type` enum('Audio', 'Video') not null, `name` varchar(200) not null) default character set utf8mb4 engine = InnoDB;";
	yield 'create table `release_event_series_names` (`id` int unsigned not null auto_increment primary key, `language` varchar(16) not null, `value` varchar(255) not null, `release_event_series_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;';
	yield "create table `release_event_series_web_links` (`id` int unsigned not null auto_increment primary key, `category` enum('Official', 'Commercial', 'Reference', 'Other') not null, `description` varchar(512) not null, `url` varchar(512) not null, `disabled` tinyint(1) not null, `release_event_series_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;";
	yield "create table `release_event_web_links` (`id` int unsigned not null auto_increment primary key, `category` enum('Official', 'Commercial', 'Reference', 'Other') not null, `description` varchar(512) not null, `url` varchar(512) not null, `disabled` tinyint(1) not null, `release_event_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;";
	yield "create table `songs` (`id` int unsigned not null auto_increment primary key, `length_seconds` int not null, `max_milli_bpm` int null, `min_milli_bpm` int null, `nico_id` varchar(20) null, `notes_original` text not null, `notes_english` text not null, `original_version_id` int unsigned null, `publish_date` datetime null, `release_event_id` int unsigned null, `song_type` enum('Unspecified', 'Original', 'Remaster', 'Remix', 'Cover', 'Arrangement', 'Instrumental', 'Mashup', 'MusicPV', 'DramaPV', 'Live', 'Illustration', 'Other') not null, `default_name_language` enum('Unspecified', 'Japanese', 'Romaji', 'English') not null, `japanese_name` varchar(255) not null, `english_name` varchar(255) not null, `romaji_name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;";
	yield "create table `pvs_for_songs` (`id` int unsigned not null auto_increment primary key, `author` varchar(100) not null, `name` varchar(200) not null, `pv_id` varchar(255) not null, `pv_type` enum('Original', 'Reprint', 'Other') not null, `service` enum('NicoNicoDouga', 'Youtube', 'SoundCloud', 'Vimeo', 'Piapro', 'Bilibili', 'File', 'LocalFile', 'Creofuga', 'Bandcamp') not null, `extended_metadata` json null, `publish_date` datetime null, `song_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;";
	yield "create table `lyrics_for_songs` (`id` int unsigned not null auto_increment primary key, `song_id` int unsigned not null, `source` varchar(255) not null, `text` text not null, `culture_code` varchar(10) not null, `translation_type` enum('Original', 'Romanized', 'Translation') not null, `url` varchar(500) not null) default character set utf8mb4 engine = InnoDB;";
	yield 'create table `artists_for_songs` (`id` int unsigned not null auto_increment primary key, `artist_id` int unsigned null, `name` varchar(255) null, `roles` int not null, `song_id` int unsigned not null, `is_support` tinyint(1) not null) default character set utf8mb4 engine = InnoDB;';
	yield 'create table `songs_in_albums` (`id` int unsigned not null auto_increment primary key, `album_id` int unsigned not null, `disc_number` int not null, `name` varchar(255) null, `song_id` int unsigned null, `track_number` int not null) default character set utf8mb4 engine = InnoDB;';
	yield 'create table `song_names` (`id` int unsigned not null auto_increment primary key, `language` varchar(16) not null, `value` varchar(255) not null, `song_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;';
	yield "create table `song_web_links` (`id` int unsigned not null auto_increment primary key, `category` enum('Official', 'Commercial', 'Reference', 'Other') not null, `description` varchar(512) not null, `url` varchar(512) not null, `disabled` tinyint(1) not null, `song_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;";
	yield "create table `tags` (`id` int unsigned not null auto_increment primary key, `category_name` varchar(30) not null, `description_original` text not null, `description_english` text not null, `hide_from_suggestions` tinyint(1) not null, `parent_id` int unsigned null, `default_name_language` enum('Unspecified', 'Japanese', 'Romaji', 'English') not null, `japanese_name` varchar(255) not null, `english_name` varchar(255) not null, `romaji_name` varchar(255) not null, `targets` int not null, `thumb_mime` varchar(30) null) default character set utf8mb4 engine = InnoDB;";
	yield 'create table `song_tag_usages` (`id` int unsigned not null auto_increment primary key, `tag_id` int unsigned not null, `count` int not null, `song_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;';
	yield 'create table `release_event_tag_usages` (`id` int unsigned not null auto_increment primary key, `tag_id` int unsigned not null, `count` int not null, `release_event_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;';
	yield 'create table `release_event_series_tag_usages` (`id` int unsigned not null auto_increment primary key, `tag_id` int unsigned not null, `count` int not null, `release_event_series_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;';
	yield 'create table `related_tags` (`id` int unsigned not null auto_increment primary key, `owner_tag_id` int unsigned not null, `linked_tag_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;';
	yield 'create table `artist_tag_usages` (`id` int unsigned not null auto_increment primary key, `tag_id` int unsigned not null, `count` int not null, `artist_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;';
	yield 'create table `album_tag_usages` (`id` int unsigned not null auto_increment primary key, `tag_id` int unsigned not null, `count` int not null, `album_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;';
	yield 'create table `tag_names` (`id` int unsigned not null auto_increment primary key, `language` varchar(16) not null, `value` varchar(255) not null, `tag_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;';
	yield "create table `tag_web_links` (`id` int unsigned not null auto_increment primary key, `category` enum('Official', 'Commercial', 'Reference', 'Other') not null, `description` varchar(512) not null, `url` varchar(512) not null, `disabled` tinyint(1) not null, `tag_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;";

	for (const tableName of TableNames) {
		yield `load data local infile '${resolve(
			outputPath,
			`${tableName}.csv`,
		)}' replace into table ${tableName} character set utf8mb4 fields terminated by ',' optionally enclosed by "'" ignore 1 lines;`;
	}

	yield 'alter table `artists` add index `artists_base_voicebank_id_index`(`base_voicebank_id`);';
	yield 'alter table `artists_for_artists` add index `artists_for_artists_group_id_index`(`group_id`);';
	yield 'alter table `artists_for_artists` add index `artists_for_artists_member_id_index`(`member_id`);';
	yield 'alter table `artist_names` add index `artist_names_artist_id_index`(`artist_id`);';
	yield 'alter table `artist_picture_files` add index `artist_picture_files_artist_id_index`(`artist_id`);';
	yield 'alter table `artist_web_links` add index `artist_web_links_artist_id_index`(`artist_id`);';
	yield 'alter table `release_events` add index `release_events_series_id_index`(`series_id`);';
	yield 'alter table `release_event_names` add index `release_event_names_release_event_id_index`(`release_event_id`);';
	yield 'alter table `pvs_for_release_events` add index `pvs_for_release_events_release_event_id_index`(`release_event_id`);';
	yield 'alter table `artists_for_release_events` add index `artists_for_release_events_artist_id_index`(`artist_id`);';
	yield 'alter table `artists_for_release_events` add index `artists_for_release_events_release_event_id_index`(`release_event_id`);';
	yield 'alter table `albums` add index `albums_original_release_release_event_id_index`(`original_release_release_event_id`);';
	yield 'alter table `pvs_for_albums` add index `pvs_for_albums_album_id_index`(`album_id`);';
	yield 'alter table `artists_for_albums` add index `artists_for_albums_artist_id_index`(`artist_id`);';
	yield 'alter table `artists_for_albums` add index `artists_for_albums_album_id_index`(`album_id`);';
	yield 'alter table `album_web_links` add index `album_web_links_album_id_index`(`album_id`);';
	yield 'alter table `album_picture_files` add index `album_picture_files_album_id_index`(`album_id`);';
	yield 'alter table `album_names` add index `album_names_album_id_index`(`album_id`);';
	yield 'alter table `album_identifiers` add index `album_identifiers_album_id_index`(`album_id`);';
	yield 'alter table `album_disc_properties` add index `album_disc_properties_album_id_index`(`album_id`);';
	yield 'alter table `release_event_series_names` add index `release_event_series_names_release_event_series_id_index`(`release_event_series_id`);';
	yield 'alter table `release_event_series_web_links` add index `release_event_series_web_links_release_event_series_id_index`(`release_event_series_id`);';
	yield 'alter table `release_event_web_links` add index `release_event_web_links_release_event_id_index`(`release_event_id`);';
	yield 'alter table `songs` add index `songs_original_version_id_index`(`original_version_id`);';
	yield 'alter table `songs` add index `songs_release_event_id_index`(`release_event_id`);';
	yield 'alter table `pvs_for_songs` add index `pvs_for_songs_song_id_index`(`song_id`);';
	yield 'alter table `lyrics_for_songs` add index `lyrics_for_songs_song_id_index`(`song_id`);';
	yield 'alter table `artists_for_songs` add index `artists_for_songs_artist_id_index`(`artist_id`);';
	yield 'alter table `artists_for_songs` add index `artists_for_songs_song_id_index`(`song_id`);';
	yield 'alter table `songs_in_albums` add index `songs_in_albums_album_id_index`(`album_id`);';
	yield 'alter table `songs_in_albums` add index `songs_in_albums_song_id_index`(`song_id`);';
	yield 'alter table `song_names` add index `song_names_song_id_index`(`song_id`);';
	yield 'alter table `song_web_links` add index `song_web_links_song_id_index`(`song_id`);';
	yield 'alter table `tags` add index `tags_parent_id_index`(`parent_id`);';
	yield 'alter table `song_tag_usages` add index `song_tag_usages_tag_id_index`(`tag_id`);';
	yield 'alter table `song_tag_usages` add index `song_tag_usages_song_id_index`(`song_id`);';
	yield 'alter table `release_event_tag_usages` add index `release_event_tag_usages_tag_id_index`(`tag_id`);';
	yield 'alter table `release_event_tag_usages` add index `release_event_tag_usages_release_event_id_index`(`release_event_id`);';
	yield 'alter table `release_event_series_tag_usages` add index `release_event_series_tag_usages_tag_id_index`(`tag_id`);';
	yield 'alter table `release_event_series_tag_usages` add index `release_event_series_tag_usages_release_event_series_id_index`(`release_event_series_id`);';
	yield 'alter table `related_tags` add index `related_tags_owner_tag_id_index`(`owner_tag_id`);';
	yield 'alter table `related_tags` add index `related_tags_linked_tag_id_index`(`linked_tag_id`);';
	yield 'alter table `artist_tag_usages` add index `artist_tag_usages_tag_id_index`(`tag_id`);';
	yield 'alter table `artist_tag_usages` add index `artist_tag_usages_artist_id_index`(`artist_id`);';
	yield 'alter table `album_tag_usages` add index `album_tag_usages_tag_id_index`(`tag_id`);';
	yield 'alter table `album_tag_usages` add index `album_tag_usages_album_id_index`(`album_id`);';
	yield 'alter table `tag_names` add index `tag_names_tag_id_index`(`tag_id`);';
	yield 'alter table `tag_web_links` add index `tag_web_links_tag_id_index`(`tag_id`);';
}

function writeToCsv<T extends object>(
	tableName: TableName,
	columnNames: readonly string[],
	items: T[],
): Promise<void> {
	function escapeValue(value: unknown): string {
		switch (typeof value) {
			case 'boolean':
				return escape(value ? 1 : 0);
			default:
				return escape(value);
		}
	}

	const lines: string[] = [];
	lines.push(columnNames.join(','));
	for (const item of items) {
		lines.push(
			Object.values(item)
				.map((value) => escapeValue(value))
				.join(','),
		);
	}
	return writeFile(resolve(outputPath, `${tableName}.csv`), lines.join('\n'));
}

async function main(): Promise<void> {
	if (!existsSync(outputPath)) {
		await mkdir(outputPath);
	}

	const { tags, tagNames, tagWebLinks, relatedTags } =
		await convertArchivedTags();
	await Promise.all([
		writeToCsv('tags', TagTableColumnNames, tags),
		writeToCsv('tag_names', NameTableColumnNames, tagNames),
		writeToCsv('tag_web_links', WebLinkTableColumnNames, tagWebLinks),
		writeToCsv('related_tags', RelatedTagTableColumnNames, relatedTags),
	]);

	const {
		artists,
		artistGroups,
		artistNames,
		artistPictureFiles,
		artistTagUsages,
		artistWebLinks,
	} = await convertArchivedArtists();
	await Promise.all([
		writeToCsv('artists', ArtistTableColumnNames, artists),
		writeToCsv(
			'artists_for_artists',
			ArtistForArtistTableColumnNames,
			artistGroups,
		),
		writeToCsv('artist_names', NameTableColumnNames, artistNames),
		writeToCsv(
			'artist_picture_files',
			PictureFileTableColumnNames,
			artistPictureFiles,
		),
		writeToCsv(
			'artist_tag_usages',
			TagUsageTableColumnNames,
			artistTagUsages,
		),
		writeToCsv('artist_web_links', WebLinkTableColumnNames, artistWebLinks),
	]);

	const {
		releaseEventSeries,
		releaseEventSeriesNames,
		releaseEventSeriesTagUsages,
		releaseEventSeriesWebLinks,
	} = await convertArchivedReleaseEventSeries();
	await Promise.all([
		writeToCsv(
			'release_event_series',
			ReleaseEventSeriesTableColumnNames,
			releaseEventSeries,
		),
		writeToCsv(
			'release_event_series_names',
			NameTableColumnNames,
			releaseEventSeriesNames,
		),
		writeToCsv(
			'release_event_series_tag_usages',
			TagUsageTableColumnNames,
			releaseEventSeriesTagUsages,
		),
		writeToCsv(
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
	} = await convertArchivedReleaseEvents();
	await Promise.all([
		writeToCsv(
			'release_events',
			ReleaseEventTableColumnNames,
			releaseEvents,
		),
		writeToCsv(
			'artists_for_release_events',
			ArtistForReleaseEventTableColumnNames,
			releaseEventArtists,
		),
		writeToCsv(
			'release_event_names',
			NameTableColumnNames,
			releaseEventNames,
		),
		writeToCsv(
			'pvs_for_release_events',
			PVTableColumnNames,
			releaseEventPVs,
		),
		writeToCsv(
			'release_event_tag_usages',
			TagUsageTableColumnNames,
			releaseEventTagUsages,
		),
		writeToCsv(
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
	} = await convertArchivedSongs();
	await Promise.all([
		writeToCsv('songs', SongTableColumnNames, songs),
		writeToCsv(
			'artists_for_songs',
			ArtistForSongTableColumnNames,
			songArtists,
		),
		writeToCsv(
			'lyrics_for_songs',
			LyricsForSongTableColumnNames,
			songLyrics,
		),
		writeToCsv('song_names', NameTableColumnNames, songNames),
		writeToCsv('pvs_for_songs', PVTableColumnNames, songPVs),
		writeToCsv('song_tag_usages', TagUsageTableColumnNames, songTagUsages),
		writeToCsv('song_web_links', WebLinkTableColumnNames, songWebLinks),
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
	} = await convertArchivedAlbums();
	await Promise.all([
		writeToCsv('albums', AlbumTableColumnNames, albums),
		writeToCsv(
			'artists_for_albums',
			ArtistForAlbumTableColumnNames,
			albumArtists,
		),
		writeToCsv(
			'album_disc_properties',
			AlbumDiscPropertiesTableColumnNames,
			albumDiscProperties,
		),
		writeToCsv(
			'album_identifiers',
			AlbumIdentifierTableColumnNames,
			albumIdentifiers,
		),
		writeToCsv('album_names', NameTableColumnNames, albumNames),
		writeToCsv(
			'album_picture_files',
			PictureFileTableColumnNames,
			albumPictureFiles,
		),
		writeToCsv('pvs_for_albums', PVTableColumnNames, albumPVs),
		writeToCsv('songs_in_albums', SongInAlbumTableColumnNames, albumSongs),
		writeToCsv(
			'album_tag_usages',
			TagUsageTableColumnNames,
			albumTagUsages,
		),
		writeToCsv('album_web_links', WebLinkTableColumnNames, albumWebLinks),
	]);

	await writeFile(
		resolve(outputPath, 'sql.sql'),
		Array.from(generateSql()).join('\n'),
	);
}

main();
