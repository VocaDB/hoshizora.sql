import { ArtistForArtist } from '@/entities/ArtistForArtist';
import { EnglishTranslatedString } from '@/entities/EnglishTranslatedString';
import { ArtistName } from '@/entities/Name';
import { ArtistPictureFile } from '@/entities/PictureFile';
import { ArtistTagUsage } from '@/entities/TagUsage';
import { TranslatedString } from '@/entities/TranslatedString';
import { ArtistWebLink } from '@/entities/WebLink';
import {
	Collection,
	Embedded,
	Entity,
	Enum,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	Property,
	Ref,
} from '@mikro-orm/core';

export enum ArtistType {
	'Unknown' = 'Unknown',
	'Circle' = 'Circle',
	'Label' = 'Label',
	'Producer' = 'Producer',
	'Animator' = 'Animator',
	'Illustrator' = 'Illustrator',
	'Lyricist' = 'Lyricist',
	'Vocaloid' = 'Vocaloid',
	'UTAU' = 'UTAU',
	'CeVIO' = 'CeVIO',
	'OtherVoiceSynthesizer' = 'OtherVoiceSynthesizer',
	'OtherVocalist' = 'OtherVocalist',
	'OtherGroup' = 'OtherGroup',
	'OtherIndividual' = 'OtherIndividual',
	'Utaite' = 'Utaite',
	'Band' = 'Band',
	'Vocalist' = 'Vocalist',
	'Character' = 'Character',
	'SynthesizerV' = 'SynthesizerV',
	'CoverArtist' = 'CoverArtist',
}

@Entity({ tableName: 'artists' })
export class Artist {
	@PrimaryKey()
	id!: number;

	@Enum(() => ArtistType)
	artistType!: ArtistType;

	@ManyToOne()
	baseVoicebank?: Ref<Artist>;

	@Embedded()
	description!: EnglishTranslatedString;

	@OneToMany(() => ArtistForArtist, (group) => group.member)
	groups = new Collection<ArtistForArtist>(this);

	@Property({ length: 32 })
	mainPictureMime?: string;

	@OneToMany(() => ArtistForArtist, (member) => member.group)
	members = new Collection<ArtistForArtist>(this);

	@OneToMany(() => ArtistName, (name) => name.artist)
	names = new Collection<ArtistName>(this);

	@OneToMany(() => ArtistPictureFile, (picture) => picture.artist)
	pictures = new Collection<ArtistPictureFile>(this);

	@Property()
	releaseDate?: Date;

	@OneToMany(() => ArtistTagUsage, (tagUsage) => tagUsage.artist)
	tagUsages = new Collection<ArtistTagUsage>(this);

	@Embedded(() => TranslatedString, { prefix: false })
	translatedName!: TranslatedString;

	@OneToMany(() => ArtistWebLink, (webLink) => webLink.artist)
	webLinks = new Collection<ArtistWebLink>(this);
}
