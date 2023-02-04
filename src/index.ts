import { Album } from '@/entities/Album';
import { AlbumDiscProperties } from '@/entities/AlbumDiscProperties';
import { AlbumIdentifier } from '@/entities/AlbumIdentifier';
import { Artist } from '@/entities/Artist';
import { ArtistForAlbum } from '@/entities/ArtistForAlbum';
import { ArtistForArtist } from '@/entities/ArtistForArtist';
import { ArtistForReleaseEvent } from '@/entities/ArtistForReleaseEvent';
import { ArtistForSong } from '@/entities/ArtistForSong';
import { LyricsForSong } from '@/entities/LyricsForSong';
import {
	AlbumName,
	ArtistName,
	ReleaseEventName,
	ReleaseEventSeriesName,
	SongName,
	TagName,
} from '@/entities/Name';
import { PVForAlbum, PVForReleaseEvent, PVForSong } from '@/entities/PV';
import { AlbumPictureFile, ArtistPictureFile } from '@/entities/PictureFile';
import { RelatedTag } from '@/entities/RelatedTag';
import { ReleaseEvent } from '@/entities/ReleaseEvent';
import { ReleaseEventSeries } from '@/entities/ReleaseEventSeries';
import { Song } from '@/entities/Song';
import { SongInAlbum } from '@/entities/SongInAlbum';
import { Tag } from '@/entities/Tag';
import {
	AlbumTagUsage,
	ArtistTagUsage,
	ReleaseEventSeriesTagUsage,
	ReleaseEventTagUsage,
	SongTagUsage,
} from '@/entities/TagUsage';
import {
	AlbumWebLink,
	ArtistWebLink,
	ReleaseEventSeriesWebLink,
	ReleaseEventWebLink,
	SongWebLink,
	TagWebLink,
} from '@/entities/WebLink';
import { ArchivedAlbumContract } from '@/models/ArchivedAlbumContract';
import { ArchivedArtistContract } from '@/models/ArchivedArtistContract';
import { ArchivedReleaseEventContract } from '@/models/ArchivedReleaseEventContract';
import { ArchivedReleaseEventSeriesContract } from '@/models/ArchivedReleaseEventSeriesContract';
import { ArchivedSongContract } from '@/models/ArchivedSongContract';
import { ArchivedTagContract } from '@/models/ArchivedTagContract';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const dumpPath = resolve(__dirname, '..', 'dump');

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
		console.log(`Importing ${jsonPath}...`);

		// TODO: Validate JSON.
		const archivedEntries = JSON.parse(
			await readFile(jsonPath, 'utf8'),
		) as TArchivedEntry[];

		for (const archived of archivedEntries) {
			yield archived;
		}

		console.log(`Imported ${jsonPath}.`);
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

		if (archived.names !== undefined) {
			for (const name of archived.names) {
				tagNames.push({
					tagId: archived.id,
					language: name.language,
					value: name.value,
				});
			}
		}

		if (archived.webLinks !== undefined) {
			for (const webLink of archived.webLinks) {
				tagWebLinks.push({
					tagId: archived.id,
					category: webLink.category,
					description: webLink.description,
					url: webLink.url,
					disabled: webLink.disabled,
				});
			}
		}

		if (archived.relatedTags !== undefined) {
			for (const relatedTag of archived.relatedTags) {
				relatedTags.push({
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
			releaseDate:
				archived.releaseDate !== undefined
					? new Date(archived.releaseDate)
					: undefined,
			defaultNameLanguage: archived.translatedName.defaultLanguage,
			japaneseName: archived.translatedName.japanese,
			englishName: archived.translatedName.english,
			romajiName: archived.translatedName.romaji,
		});

		if (archived.groups !== undefined) {
			for (const group of archived.groups) {
				artistGroups.push({
					memberId: archived.id,
					groupId: group.id,
					linkType: group.linkType,
				});
			}
		}

		if (archived.names !== undefined) {
			for (const name of archived.names) {
				artistNames.push({
					artistId: archived.id,
					language: name.language,
					value: name.value,
				});
			}
		}

		if (archived.pictures !== undefined) {
			for (const picture of archived.pictures) {
				artistPictureFiles.push({
					artistId: archived.id,
					created: new Date(picture.created),
					mime: picture.mime,
					name: picture.name,
				});
			}
		}

		if (archived.tags !== undefined) {
			for (const tag of archived.tags) {
				artistTagUsages.push({
					artistId: archived.id,
					tagId: tag.tag.id,
					count: tag.count,
				});
			}
		}

		if (archived.webLinks !== undefined) {
			for (const webLink of archived.webLinks) {
				artistWebLinks.push({
					artistId: archived.id,
					category: webLink.category,
					description: webLink.description,
					url: webLink.url,
					disabled: webLink.disabled,
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

		if (archived.names !== undefined) {
			for (const name of archived.names) {
				releaseEventSeriesNames.push({
					releaseEventSeriesId: archived.id,
					language: name.language,
					value: name.value,
				});
			}
		}

		if (archived.tags !== undefined) {
			for (const tag of archived.tags) {
				releaseEventSeriesTagUsages.push({
					releaseEventSeriesId: archived.id,
					tagId: tag.tag.id,
					count: tag.count,
				});
			}
		}

		if (archived.webLinks !== undefined) {
			for (const webLink of archived.webLinks) {
				releaseEventSeriesWebLinks.push({
					releaseEventSeriesId: archived.id,
					category: webLink.category,
					description: webLink.description,
					url: webLink.url,
					disabled: webLink.disabled,
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
			date:
				archived.date !== undefined
					? new Date(archived.date)
					: undefined,
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

		if (archived.artists !== undefined) {
			for (const artist of archived.artists) {
				releaseEventArtists.push({
					releaseEventId: archived.id,
					artistId: artist.id,
					name: artist.nameHint,
					roles: artist.roles,
				});
			}
		}

		if (archived.names !== undefined) {
			for (const name of archived.names) {
				releaseEventNames.push({
					releaseEventId: archived.id,
					language: name.language,
					value: name.value,
				});
			}
		}

		if (archived.pvs !== undefined) {
			for (const pv of archived.pvs) {
				releaseEventPVs.push({
					releaseEventId: archived.id,
					author: pv.author,
					name: pv.name,
					pvId: pv.pvId,
					pvType: pv.pvType,
					service: pv.service,
					extendedMetadata: pv.extendedMetadata,
					publishDate:
						pv.publishDate !== undefined
							? new Date(pv.publishDate)
							: undefined,
				});
			}
		}

		if (archived.tags !== undefined) {
			for (const tag of archived.tags) {
				releaseEventTagUsages.push({
					releaseEventId: archived.id,
					tagId: tag.tag.id,
					count: tag.count,
				});
			}
		}

		if (archived.webLinks !== undefined) {
			for (const webLink of archived.webLinks) {
				releaseEventWebLinks.push({
					releaseEventId: archived.id,
					category: webLink.category,
					description: webLink.description,
					url: webLink.url,
					disabled: webLink.disabled,
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
			publishDate:
				archived.publishDate !== undefined
					? new Date(archived.publishDate)
					: undefined,
			releaseEventId: archived.releaseEvent?.id,
			songType: archived.songType,
			defaultNameLanguage: archived.translatedName.defaultLanguage,
			japaneseName: archived.translatedName.japanese,
			englishName: archived.translatedName.english,
			romajiName: archived.translatedName.romaji,
		});

		if (archived.artists !== undefined) {
			for (const artist of archived.artists) {
				songArtists.push({
					songId: archived.id,
					artistId: artist.id,
					name: artist.nameHint,
					roles: artist.roles,
					isSupport: artist.isSupport,
				});
			}
		}

		if (archived.lyrics !== undefined) {
			for (const lyrics of archived.lyrics) {
				songLyrics.push({
					songId: archived.id,
					source: lyrics.source,
					text: lyrics.value ?? '',
					cultureCode: lyrics.cultureCode,
					translationType: lyrics.translationType,
					url: lyrics.url,
				});
			}
		}

		if (archived.names !== undefined) {
			for (const name of archived.names) {
				songNames.push({
					songId: archived.id,
					language: name.language,
					value: name.value,
				});
			}
		}

		if (archived.pvs !== undefined) {
			for (const pv of archived.pvs) {
				songPVs.push({
					songId: archived.id,
					author: pv.author,
					name: pv.name,
					pvId: pv.pvId,
					pvType: pv.pvType,
					service: pv.service,
					extendedMetadata: pv.extendedMetadata,
					publishDate:
						pv.publishDate !== undefined
							? new Date(pv.publishDate)
							: undefined,
				});
			}
		}

		if (archived.tags !== undefined) {
			for (const tag of archived.tags) {
				songTagUsages.push({
					songId: archived.id,
					tagId: tag.tag.id,
					count: tag.count,
				});
			}
		}

		if (archived.webLinks !== undefined) {
			for (const webLink of archived.webLinks) {
				songWebLinks.push({
					songId: archived.id,
					category: webLink.category,
					description: webLink.description,
					url: webLink.url,
					disabled: webLink.disabled,
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

		if (archived.artists !== undefined) {
			for (const artist of archived.artists) {
				albumArtists.push({
					albumId: archived.id,
					artistId: artist.id,
					name: artist.nameHint,
					isSupport: artist.isSupport,
					roles: artist.roles,
				});
			}
		}

		if (archived.discs !== undefined) {
			for (const disc of archived.discs) {
				albumDiscProperties.push({
					albumId: archived.id,
					discNumber: disc.discNumber,
					mediaType: disc.mediaType,
					name: disc.name,
				});
			}
		}

		if (archived.identifiers !== undefined) {
			for (const identifier of archived.identifiers) {
				albumIdentifiers.push({
					albumId: archived.id,
					value: identifier.value,
				});
			}
		}

		if (archived.names !== undefined) {
			for (const name of archived.names) {
				albumNames.push({
					albumId: archived.id,
					language: name.language,
					value: name.value,
				});
			}
		}

		if (archived.pictures !== undefined) {
			for (const picture of archived.pictures) {
				albumPictureFiles.push({
					albumId: archived.id,
					created: new Date(picture.created),
					mime: picture.mime,
					name: picture.name,
				});
			}
		}

		if (archived.pvs !== undefined) {
			for (const pv of archived.pvs) {
				albumPVs.push({
					albumId: archived.id,
					author: pv.author,
					name: pv.name,
					pvId: pv.pvId,
					pvType: pv.pvType,
					service: pv.service,
					extendedMetadata: pv.extendedMetadata,
					publishDate:
						pv.publishDate !== undefined
							? new Date(pv.publishDate)
							: undefined,
				});
			}
		}

		if (archived.songs !== undefined) {
			for (const song of archived.songs) {
				albumSongs.push({
					albumId: archived.id,
					discNumber: song.discNumber,
					name: song.nameHint,
					songId: song.id,
					trackNumber: song.trackNumber,
				});
			}
		}

		if (archived.tags !== undefined) {
			for (const tag of archived.tags) {
				albumTagUsages.push({
					albumId: archived.id,
					tagId: tag.tag.id,
					count: tag.count,
				});
			}
		}

		if (archived.webLinks !== undefined) {
			for (const webLink of archived.webLinks) {
				albumWebLinks.push({
					albumId: archived.id,
					category: webLink.category,
					description: webLink.description,
					url: webLink.url,
					disabled: webLink.disabled,
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

async function main(): Promise<void> {
	const { tags, tagNames, tagWebLinks, relatedTags } =
		await convertArchivedTags();

	const {
		artists,
		artistGroups,
		artistNames,
		artistPictureFiles,
		artistTagUsages,
		artistWebLinks,
	} = await convertArchivedArtists();

	const {
		releaseEventSeries,
		releaseEventSeriesNames,
		releaseEventSeriesTagUsages,
		releaseEventSeriesWebLinks,
	} = await convertArchivedReleaseEventSeries();

	const {
		releaseEvents,
		releaseEventArtists,
		releaseEventNames,
		releaseEventPVs,
		releaseEventTagUsages,
		releaseEventWebLinks,
	} = await convertArchivedReleaseEvents();

	const {
		songs,
		songArtists,
		songNames,
		songPVs,
		songTagUsages,
		songWebLinks,
	} = await convertArchivedSongs();

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
}

main();
