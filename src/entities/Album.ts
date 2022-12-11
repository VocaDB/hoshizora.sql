import { AlbumDiscProperties } from '@/entities/AlbumDiscProperties';
import { AlbumIdentifier } from '@/entities/AlbumIdentifier';
import { AlbumRelease } from '@/entities/AlbumRelease';
import { ArtistForAlbum } from '@/entities/ArtistForAlbum';
import { EnglishTranslatedString } from '@/entities/EnglishTranslatedString';
import { AlbumName } from '@/entities/Name';
import { PVForAlbum } from '@/entities/PV';
import { AlbumPictureFile } from '@/entities/PictureFile';
import { SongInAlbum } from '@/entities/SongInAlbum';
import { AlbumTagUsage } from '@/entities/TagUsage';
import { TranslatedString } from '@/entities/TranslatedString';
import { AlbumWebLink } from '@/entities/WebLink';
import {
	Collection,
	Embedded,
	Entity,
	Enum,
	OneToMany,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';

export enum DiscType {
	'Unknown' = 'Unknown',
	'Album' = 'Album',
	'Single' = 'Single',
	'EP' = 'EP',
	'SplitAlbum' = 'SplitAlbum',
	'Compilation' = 'Compilation',
	'Video' = 'Video',
	'Artbook' = 'Artbook',
	'Game' = 'Game',
	'Fanmade' = 'Fanmade',
	'Instrumental' = 'Instrumental',
	'Other' = 'Other',
}

@Entity({ tableName: 'albums' })
export class Album {
	@PrimaryKey()
	id!: number;

	@OneToMany(() => ArtistForAlbum, (artistLink) => artistLink.album)
	artistLinks = new Collection<ArtistForAlbum>(this);

	@Embedded()
	description!: EnglishTranslatedString;

	@OneToMany(() => AlbumDiscProperties, (disc) => disc.album)
	discs = new Collection<AlbumDiscProperties>(this);

	@Enum(() => DiscType)
	discType!: DiscType;

	@OneToMany(() => AlbumIdentifier, (identifier) => identifier.album)
	identifiers = new Collection<AlbumIdentifier>(this);

	@Property({ length: 32 })
	mainPictureMime?: string;

	@OneToMany(() => AlbumName, (name) => name.album)
	names = new Collection<AlbumName>(this);

	@Embedded()
	originalRelease!: AlbumRelease;

	@OneToMany(() => AlbumPictureFile, (picture) => picture.album)
	pictures = new Collection<AlbumPictureFile>(this);

	@OneToMany(() => PVForAlbum, (pv) => pv.album)
	pvs = new Collection<PVForAlbum>(this);

	@OneToMany(() => SongInAlbum, (songLink) => songLink.album)
	songLinks = new Collection<SongInAlbum>(this);

	@OneToMany(() => AlbumTagUsage, (tagUsage) => tagUsage.album)
	tagUsages = new Collection<AlbumTagUsage>(this);

	@Embedded(() => TranslatedString, { prefix: false })
	translatedName!: TranslatedString;

	@OneToMany(() => AlbumWebLink, (webLink) => webLink.album)
	webLinks = new Collection<AlbumWebLink>(this);
}
