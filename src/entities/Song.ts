import { ArtistForSong } from '@/entities/ArtistForSong';
import { EnglishTranslatedString } from '@/entities/EnglishTranslatedString';
import { LyricsForSong } from '@/entities/LyricsForSong';
import { SongName } from '@/entities/Name';
import { PVForSong } from '@/entities/PV';
import { ReleaseEvent } from '@/entities/ReleaseEvent';
import { SongTagUsage } from '@/entities/TagUsage';
import { TranslatedString } from '@/entities/TranslatedString';
import { SongWebLink } from '@/entities/WebLink';
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

export enum SongType {
	'Unspecified' = 'Unspecified',
	'Original' = 'Original',
	'Remaster' = 'Remaster',
	'Remix' = 'Remix',
	'Cover' = 'Cover',
	'Arrangement' = 'Arrangement',
	'Instrumental' = 'Instrumental',
	'Mashup' = 'Mashup',
	'MusicPV' = 'MusicPV',
	'DramaPV' = 'DramaPV',
	'Live' = 'Live',
	'Illustration' = 'Illustration',
	'Other' = 'Other',
}

@Entity({ tableName: 'songs' })
export class Song {
	@PrimaryKey()
	id!: number;

	@OneToMany(() => ArtistForSong, (artistLink) => artistLink.song)
	artistLinks = new Collection<ArtistForSong>(this);

	@Property()
	lengthSeconds!: number;

	@OneToMany(() => LyricsForSong, (lyrics) => lyrics.song)
	lyrics = new Collection<LyricsForSong>(this);

	// TODO: BpmRange.upperBound
	@Property()
	maxMilliBpm?: number;

	// TODO: BpmRange.lowerBound
	@Property()
	minMilliBpm?: number;

	@OneToMany(() => SongName, (name) => name.song)
	names = new Collection<SongName>(this);

	@Property({ length: 20 })
	nicoId?: string;

	@Embedded()
	notes!: EnglishTranslatedString;

	@ManyToOne()
	originalVersion?: Ref<Song>;

	@Property()
	publishDate?: Date;

	@OneToMany(() => PVForSong, (pv) => pv.song)
	pvs = new Collection<PVForSong>(this);

	@ManyToOne()
	releaseEvent?: Ref<ReleaseEvent>;

	@Enum(() => SongType)
	songType!: SongType;

	@OneToMany(() => SongTagUsage, (tagUsage) => tagUsage.song)
	tagUsages = new Collection<SongTagUsage>(this);

	@Embedded(() => TranslatedString, { prefix: false })
	translatedName!: TranslatedString;

	@OneToMany(() => SongWebLink, (webLink) => webLink.song)
	webLinks = new Collection<SongWebLink>(this);
}
