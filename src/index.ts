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
import { snapshot } from '@/snapshot';
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

export type TableName = typeof snapshot.tables[number]['name'];

// https://stackoverflow.com/questions/49401866/all-possible-keys-of-an-union-type/49402091#49402091
type ValuesOfUnion<T> = T extends T ? T[keyof T] : never;

type TableColumns = typeof snapshot.tables[number]['columns'];
export type TableColumn = ValuesOfUnion<TableColumns>;

function* generateSql(): Generator<string> {
	const tables = snapshot.tables;

	for (const table of tables) {
		yield `drop table if exists \`${table.name}\`;`;
	}

	for (const table of tables) {
		yield `create table \`${table.name}\` (${Object.entries(table.columns)
			.map(([, value]: [string, TableColumn]) => {
				const result: string[] = [];
				result.push(`\`${value.name}\``);
				result.push(value.type);
				if (value.unsigned) {
					result.push('unsigned');
				}
				result.push(value.nullable ? 'null' : 'not null');
				if (value.autoincrement) {
					result.push('auto_increment');
				}
				if (value.primary) {
					result.push('primary key');
				}
				return `${result.join(' ')}`;
			})
			.join(', ')}) default character set utf8mb4 engine = InnoDB;`;
	}

	for (const table of tables) {
		yield `load data local infile '${resolve(
			outputPath,
			`${table.name}.csv`,
		)}' replace into table ${
			table.name
		} character set utf8mb4 fields terminated by ',' optionally enclosed by "'" ignore 1 lines;`;
	}

	for (const table of tables) {
		for (const index of table.indexes) {
			yield `alter table \`${table.name}\` add index \`${index.keyName}\`(\`${index.columnNames}\`);`;
		}
	}
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
