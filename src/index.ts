import { Album } from '@/entities/Album';
import { AlbumDiscProperties } from '@/entities/AlbumDiscProperties';
import { AlbumIdentifier } from '@/entities/AlbumIdentifier';
import { AlbumRelease } from '@/entities/AlbumRelease';
import { Artist } from '@/entities/Artist';
import { ArtistForAlbum } from '@/entities/ArtistForAlbum';
import { ArtistForArtist } from '@/entities/ArtistForArtist';
import { ArtistForReleaseEvent } from '@/entities/ArtistForReleaseEvent';
import { ArtistForSong } from '@/entities/ArtistForSong';
import { EnglishTranslatedString } from '@/entities/EnglishTranslatedString';
import { LyricsForSong } from '@/entities/LyricsForSong';
import {
	AlbumName,
	ArtistName,
	Name,
	ReleaseEventName,
	ReleaseEventSeriesName,
	SongName,
	TagName,
} from '@/entities/Name';
import { PV, PVForAlbum, PVForReleaseEvent, PVForSong } from '@/entities/PV';
import {
	AlbumPictureFile,
	ArtistPictureFile,
	PictureFile,
} from '@/entities/PictureFile';
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
	TagUsage,
} from '@/entities/TagUsage';
import { TranslatedString } from '@/entities/TranslatedString';
import {
	AlbumWebLink,
	ArtistWebLink,
	ReleaseEventSeriesWebLink,
	ReleaseEventWebLink,
	SongWebLink,
	TagWebLink,
	WebLink,
} from '@/entities/WebLink';
import config from '@/mikro-orm.config';
import {
	AlbumDiscPropertiesContract,
	AlbumIdentifierContract,
	ArchivedAlbumContract,
} from '@/models/ArchivedAlbumContract';
import { ArchivedArtistContract } from '@/models/ArchivedArtistContract';
import { ArchivedEntryPictureFileContract } from '@/models/ArchivedEntryPictureFileContract';
import { ArchivedPVContract } from '@/models/ArchivedPVContract';
import { ArchivedReleaseEventContract } from '@/models/ArchivedReleaseEventContract';
import { ArchivedReleaseEventSeriesContract } from '@/models/ArchivedReleaseEventSeriesContract';
import {
	ArchivedSongContract,
	LyricsForSongContract,
} from '@/models/ArchivedSongContract';
import { ArchivedTagContract } from '@/models/ArchivedTagContract';
import { ArchivedTagUsageContract } from '@/models/ArchivedTagUsageContract';
import { ArchivedTranslatedStringContract } from '@/models/ArchivedTranslatedStringContract';
import { ArchivedWebLinkContract } from '@/models/ArchivedWebLinkContract';
import { LocalizedStringContract } from '@/models/LocalizedStringContract';
import {
	ArchivedArtistForAlbumContract,
	ArchivedArtistForArtistContract,
	ArchivedArtistForReleaseEventContract,
	ArchivedArtistForSongContract,
	ObjectRefContract,
	SongInAlbumRefContract,
} from '@/models/ObjectRefContract';
import { EntityManager, MikroORM, Reference } from '@mikro-orm/core';
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

type Entry = Album | Artist | ReleaseEvent | ReleaseEventSeries | Song | Tag;

const importEntries = async <
	TArchivedEntry extends ArchivedEntry,
	TEntry extends Entry,
>(
	em: EntityManager,
	folder: 'Albums' | 'Artists' | 'Events' | 'EventSeries' | 'Songs' | 'Tags',
	entryFactory: (archivedEntry: TArchivedEntry) => TEntry,
): Promise<void> => {
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

		await em.transactional(async (em) => {
			for (const archived of archivedEntries) {
				const entry = entryFactory(archived);
				em.persist(entry);
			}
		});

		em.clear();

		console.log(`Imported ${jsonPath}.`);
	}
};

const createTranslatedString = (
	archived: ArchivedTranslatedStringContract,
): TranslatedString => {
	const translatedName = new TranslatedString();
	translatedName.defaultNameLanguage = archived.defaultLanguage;
	translatedName.japaneseName = archived.japanese;
	translatedName.englishName = archived.english;
	translatedName.romajiName = archived.romaji;
	return translatedName;
};

const createName = <TName extends Name>(
	ctor: new () => TName,
	archived: LocalizedStringContract,
): TName => {
	const name = new ctor();
	name.language = archived.language;
	name.value = archived.value;
	return name;
};

const createPicture = <TPictureFile extends PictureFile>(
	ctor: new () => TPictureFile,
	archived: ArchivedEntryPictureFileContract,
): TPictureFile => {
	const pictureFile = new ctor();
	pictureFile.created = new Date(archived.created);
	pictureFile.mime = archived.mime;
	pictureFile.name = archived.name;
	return pictureFile;
};

const createPV = <TPV extends PV>(
	ctor: new () => TPV,
	archived: ArchivedPVContract,
): TPV => {
	const pv = new ctor();
	pv.author = archived.author;
	pv.extendedMetadata = archived.extendedMetadata;
	pv.name = archived.name;
	pv.publishDate = archived.publishDate
		? new Date(archived.publishDate)
		: undefined;
	pv.pvId = archived.pvId;
	pv.pvType = archived.pvType;
	pv.service = archived.service;
	return pv;
};

const createTagUsage = <TTagUsage extends TagUsage>(
	ctor: new () => TTagUsage,
	archived: ArchivedTagUsageContract,
): TTagUsage => {
	const tagUsage = new ctor();
	tagUsage.count = archived.count;
	tagUsage.tag = Reference.createFromPK(Tag, archived.tag.id);
	return tagUsage;
};

const createWebLink = <TWebLink extends WebLink>(
	ctor: new () => TWebLink,
	archived: ArchivedWebLinkContract,
): TWebLink => {
	const webLink = new ctor();
	webLink.category = archived.category;
	webLink.description = archived.description;
	webLink.disabled = archived.disabled;
	webLink.url = archived.url;
	return webLink;
};

const importTags = (em: EntityManager): Promise<void> => {
	const createTag = (archived: ArchivedTagContract): Tag => {
		const createTagName = (archived: LocalizedStringContract): TagName => {
			return createName(TagName, archived);
		};

		const createRelatedTag = (archived: ObjectRefContract): RelatedTag => {
			const relatedTag = new RelatedTag();
			relatedTag.linkedTag = Reference.createFromPK(Tag, archived.id);
			return relatedTag;
		};

		const createTagWebLink = (
			archived: ArchivedWebLinkContract,
		): TagWebLink => {
			return createWebLink(TagWebLink, archived);
		};

		const tag = new Tag();

		tag.id = archived.id;
		tag.categoryName = archived.categoryName;

		tag.description = new EnglishTranslatedString();
		tag.description.original = archived.description ?? '';
		tag.description.english = archived.descriptionEng ?? '';

		tag.hideFromSuggestions = archived.hideFromSuggestions;
		tag.names.add(archived.names?.map(createTagName) ?? []);
		tag.parent = archived.parent
			? Reference.createFromPK(Tag, archived.parent.id)
			: undefined;
		tag.relatedTags.add(archived.relatedTags?.map(createRelatedTag) ?? []);
		tag.translatedName = createTranslatedString(archived.translatedName);
		tag.targets = archived.targets;
		tag.thumbMime = archived.thumbMime;
		tag.webLinks.add(archived.webLinks?.map(createTagWebLink) ?? []);

		return tag;
	};

	return importEntries(em, 'Tags', createTag);
};

const importArtists = (em: EntityManager): Promise<void> => {
	const createArtist = (archived: ArchivedArtistContract): Artist => {
		const createArtistLink = (
			archived: ArchivedArtistForArtistContract,
		): ArtistForArtist => {
			const artistLink = new ArtistForArtist();
			artistLink.group = Reference.createFromPK(Artist, archived.id);
			artistLink.linkType = archived.linkType;
			return artistLink;
		};

		const createArtistName = (
			archived: LocalizedStringContract,
		): ArtistName => {
			return createName(ArtistName, archived);
		};

		const createArtistPicture = (
			archived: ArchivedEntryPictureFileContract,
		): ArtistPictureFile => {
			return createPicture(ArtistPictureFile, archived);
		};

		const createArtistTagUsage = (
			archived: ArchivedTagUsageContract,
		): ArtistTagUsage => {
			return createTagUsage(ArtistTagUsage, archived);
		};

		const createArtistWebLink = (
			archived: ArchivedWebLinkContract,
		): ArtistWebLink => {
			return createWebLink(ArtistWebLink, archived);
		};

		const artist = new Artist();

		artist.id = archived.id;
		artist.artistType = archived.artistType;
		artist.baseVoicebank = archived.baseVoicebank
			? Reference.createFromPK(Artist, archived.baseVoicebank.id)
			: undefined;

		artist.description = new EnglishTranslatedString();
		artist.description.original = archived.description ?? '';
		artist.description.english = archived.descriptionEng ?? '';

		artist.groups.add(archived.groups?.map(createArtistLink) ?? []);
		artist.mainPictureMime = archived.mainPictureMime;
		artist.names.add(archived.names?.map(createArtistName) ?? []);
		artist.pictures.add(archived.pictures?.map(createArtistPicture) ?? []);
		artist.releaseDate = archived.releaseDate
			? new Date(archived.releaseDate)
			: undefined;
		artist.tagUsages.add(archived.tags.map(createArtistTagUsage));
		artist.translatedName = createTranslatedString(archived.translatedName);
		artist.webLinks.add(archived.webLinks?.map(createArtistWebLink) ?? []);

		return artist;
	};

	return importEntries(em, 'Artists', createArtist);
};

const importReleaseEventSeries = (em: EntityManager): Promise<void> => {
	const createReleaseEventSeries = (
		archived: ArchivedReleaseEventSeriesContract,
	): ReleaseEventSeries => {
		const createReleaseEventSeriesName = (
			archived: LocalizedStringContract,
		): ReleaseEventSeriesName => {
			return createName(ReleaseEventSeriesName, archived);
		};

		const createReleaseEventSeriesTagUsage = (
			archived: ArchivedTagUsageContract,
		): ReleaseEventSeriesTagUsage => {
			return createTagUsage(ReleaseEventSeriesTagUsage, archived);
		};

		const createReleaseEventSeriesWebLink = (
			archived: ArchivedWebLinkContract,
		): ReleaseEventSeriesWebLink => {
			return createWebLink(ReleaseEventSeriesWebLink, archived);
		};

		const releaseEventSeries = new ReleaseEventSeries();
		releaseEventSeries.id = archived.id;
		releaseEventSeries.category = archived.category;
		releaseEventSeries.description = archived.description;
		releaseEventSeries.mainPictureMime = archived.mainPictureMime;
		releaseEventSeries.names.add(
			archived.names?.map(createReleaseEventSeriesName) ?? [],
		);
		releaseEventSeries.tagUsages.add(
			archived.tags.map(createReleaseEventSeriesTagUsage),
		);
		releaseEventSeries.translatedName = createTranslatedString(
			archived.translatedName,
		);
		releaseEventSeries.webLinks.add(
			archived.webLinks?.map(createReleaseEventSeriesWebLink) ?? [],
		);
		return releaseEventSeries;
	};

	return importEntries(em, 'EventSeries', createReleaseEventSeries);
};

const importReleaseEvents = (em: EntityManager): Promise<void> => {
	const createReleaseEvent = (
		archived: ArchivedReleaseEventContract,
	): ReleaseEvent => {
		const createReleaseEventArtistLink = (
			archived: ArchivedArtistForReleaseEventContract,
		): ArtistForReleaseEvent => {
			const artistLink = new ArtistForReleaseEvent();
			if (archived.id) {
				artistLink.artist = Reference.createFromPK(Artist, archived.id);
			} else {
				artistLink.name = archived.nameHint;
			}
			artistLink.roles = archived.roles;
			return artistLink;
		};

		const createReleaseEventName = (
			archived: LocalizedStringContract,
		): ReleaseEventName => {
			return createName(ReleaseEventName, archived);
		};

		const createReleaseEventPV = (
			archived: ArchivedPVContract,
		): PVForReleaseEvent => {
			return createPV(PVForReleaseEvent, archived);
		};

		const createReleaseEventTagUsage = (
			archived: ArchivedTagUsageContract,
		): ReleaseEventTagUsage => {
			return createTagUsage(ReleaseEventTagUsage, archived);
		};

		const createReleaseEventWebLink = (
			archived: ArchivedWebLinkContract,
		): ReleaseEventWebLink => {
			return createWebLink(ReleaseEventWebLink, archived);
		};

		const releaseEvent = new ReleaseEvent();
		releaseEvent.id = archived.id;
		releaseEvent.artistLinks.add(
			archived.artists?.map(createReleaseEventArtistLink) ?? [],
		);
		releaseEvent.category = archived.category;
		releaseEvent.date = archived.date ? new Date(archived.date) : undefined;
		releaseEvent.description = archived.description;
		releaseEvent.mainPictureMime = archived.mainPictureMime;
		releaseEvent.names.add(
			archived.names?.map(createReleaseEventName) ?? [],
		);
		releaseEvent.pvs.add(archived.pvs?.map(createReleaseEventPV) ?? []);
		releaseEvent.series = archived.series
			? Reference.createFromPK(ReleaseEventSeries, archived.series.id)
			: undefined;
		releaseEvent.seriesNumber = archived.seriesNumber;
		releaseEvent.tagUsages.add(
			archived.tags.map(createReleaseEventTagUsage),
		);
		releaseEvent.translatedName = createTranslatedString(
			archived.translatedName,
		);
		releaseEvent.venueName = archived.venueName;
		releaseEvent.webLinks.add(
			archived.webLinks?.map(createReleaseEventWebLink) ?? [],
		);
		return releaseEvent;
	};

	return importEntries(em, 'Events', createReleaseEvent);
};

const importSongs = (em: EntityManager): Promise<void> => {
	const createSong = (archived: ArchivedSongContract): Song => {
		const createSongArtistLink = (
			archived: ArchivedArtistForSongContract,
		): ArtistForSong => {
			const artistLink = new ArtistForSong();
			if (archived.id) {
				artistLink.artist = Reference.createFromPK(Artist, archived.id);
			} else {
				artistLink.name = archived.nameHint;
			}
			artistLink.isSupport = archived.isSupport;
			artistLink.roles = archived.roles;
			return artistLink;
		};

		const createLyrics = (
			archived: LyricsForSongContract,
		): LyricsForSong => {
			const lyrics = new LyricsForSong();
			lyrics.cultureCode = archived.cultureCode;
			lyrics.source = archived.source;
			lyrics.text = archived.value ?? '';
			lyrics.translationType = archived.translationType;
			lyrics.url = archived.url;
			return lyrics;
		};

		const createSongName = (
			archived: LocalizedStringContract,
		): SongName => {
			return createName(SongName, archived);
		};

		const createSongPV = (archived: ArchivedPVContract): PVForSong => {
			return createPV(PVForSong, archived);
		};

		const createSongTagUsage = (
			archived: ArchivedTagUsageContract,
		): SongTagUsage => {
			return createTagUsage(SongTagUsage, archived);
		};

		const createSongWebLink = (
			archived: ArchivedWebLinkContract,
		): SongWebLink => {
			return createWebLink(SongWebLink, archived);
		};

		const song = new Song();

		song.id = archived.id;
		song.artistLinks.add(archived.artists?.map(createSongArtistLink) ?? []);
		song.lengthSeconds = archived.lengthSeconds;
		song.lyrics.add(archived.lyrics?.map(createLyrics) ?? []);
		song.maxMilliBpm = archived.maxMilliBpm;
		song.minMilliBpm = archived.minMilliBpm;
		song.names.add(archived.names?.map(createSongName) ?? []);
		song.nicoId = archived.nicoId;

		song.notes = new EnglishTranslatedString();
		song.notes.original = archived.notes;
		song.notes.english = archived.notesEng;

		song.originalVersion = archived.originalVersion
			? Reference.createFromPK(Song, archived.originalVersion.id)
			: undefined;
		song.publishDate = archived.publishDate
			? new Date(archived.publishDate)
			: undefined;
		song.pvs.add(archived.pvs?.map(createSongPV) ?? []);
		song.releaseEvent = archived.releaseEvent
			? Reference.createFromPK(ReleaseEvent, archived.releaseEvent.id)
			: undefined;
		song.songType = archived.songType;
		song.tagUsages.add(archived.tags.map(createSongTagUsage));
		song.translatedName = createTranslatedString(archived.translatedName);
		song.webLinks.add(archived.webLinks?.map(createSongWebLink) ?? []);

		return song;
	};

	return importEntries(em, 'Songs', createSong);
};

const importAlbums = (em: EntityManager): Promise<void> => {
	const createAlbum = (archived: ArchivedAlbumContract): Album => {
		const createAlbumArtistLink = (
			archived: ArchivedArtistForAlbumContract,
		): ArtistForAlbum => {
			const artistLink = new ArtistForAlbum();
			if (archived.id) {
				artistLink.artist = Reference.createFromPK(Artist, archived.id);
			} else {
				artistLink.name = archived.nameHint;
			}
			artistLink.isSupport = archived.isSupport;
			artistLink.roles = archived.roles;
			return artistLink;
		};

		const createAlbumDisc = (
			archived: AlbumDiscPropertiesContract,
		): AlbumDiscProperties => {
			const disc = new AlbumDiscProperties();
			disc.discNumber = archived.discNumber;
			disc.mediaType = archived.mediaType;
			disc.name = archived.name;
			return disc;
		};

		const createAlbumIdentifier = (
			archived: AlbumIdentifierContract,
		): AlbumIdentifier => {
			const identifier = new AlbumIdentifier();
			identifier.value = archived.value;
			return identifier;
		};

		const createAlbumName = (
			archived: LocalizedStringContract,
		): AlbumName => {
			return createName(AlbumName, archived);
		};

		const createAlbumPicture = (
			archived: ArchivedEntryPictureFileContract,
		): AlbumPictureFile => {
			return createPicture(AlbumPictureFile, archived);
		};

		const createAlbumPV = (archived: ArchivedPVContract): PVForAlbum => {
			return createPV(PVForAlbum, archived);
		};

		const createAlbumTagUsage = (
			archived: ArchivedTagUsageContract,
		): AlbumTagUsage => {
			return createTagUsage(AlbumTagUsage, archived);
		};

		const createAlbumSongLink = (
			archived: SongInAlbumRefContract,
		): SongInAlbum => {
			const songLink = new SongInAlbum();
			if (archived.id) {
				songLink.song = Reference.createFromPK(Song, archived.id);
			} else {
				songLink.name = archived.nameHint;
			}
			songLink.discNumber = archived.discNumber;
			songLink.trackNumber = archived.trackNumber;
			return songLink;
		};

		const createAlbumWebLink = (
			archived: ArchivedWebLinkContract,
		): AlbumWebLink => {
			return createWebLink(AlbumWebLink, archived);
		};

		const album = new Album();

		album.id = archived.id;

		album.artistLinks.add(
			archived.artists?.map(createAlbumArtistLink) ?? [],
		);
		album.description = new EnglishTranslatedString();
		album.description.original = archived.description ?? '';
		album.description.english = archived.descriptionEng ?? '';

		album.discs.add(archived.discs?.map(createAlbumDisc) ?? []);
		album.discType = archived.discType;
		album.identifiers.add(
			archived.identifiers?.map(createAlbumIdentifier) ?? [],
		);
		album.mainPictureMime = archived.mainPictureMime;
		album.names.add(archived.names?.map(createAlbumName) ?? []);

		album.originalRelease = new AlbumRelease();
		const { originalRelease } = archived;
		if (originalRelease) {
			album.originalRelease.catNum = originalRelease.catNum;
			const { releaseDate } = originalRelease;
			if (releaseDate) {
				album.originalRelease.day = releaseDate.day;
				album.originalRelease.month = releaseDate.month;
				album.originalRelease.year = releaseDate.year;
			}
			album.originalRelease.releaseEvent = originalRelease.releaseEvent
				? Reference.createFromPK(
						ReleaseEvent,
						originalRelease.releaseEvent.id,
				  )
				: undefined;
		}

		album.pictures.add(archived.pictures?.map(createAlbumPicture) ?? []);
		album.pvs.add(archived.pvs?.map(createAlbumPV) ?? []);
		album.songLinks.add(archived.songs?.map(createAlbumSongLink) ?? []);
		album.tagUsages.add(archived.tags.map(createAlbumTagUsage));
		album.translatedName = createTranslatedString(archived.translatedName);
		album.webLinks.add(archived.webLinks?.map(createAlbumWebLink) ?? []);

		return album;
	};

	return importEntries(em, 'Albums', createAlbum);
};

const main = async (): Promise<void> => {
	const orm = await MikroORM.init(config);

	const generator = orm.getSchemaGenerator();
	await generator.clearDatabase();

	const em = orm.em.fork();

	await importTags(em);
	await importArtists(em);
	await importReleaseEventSeries(em);
	await importReleaseEvents(em);
	await importSongs(em);
	await importAlbums(em);

	await orm.close();
};

main();
