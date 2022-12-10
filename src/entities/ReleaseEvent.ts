import { ArtistForReleaseEvent } from '@/entities/ArtistForReleaseEvent';
import { ReleaseEventName } from '@/entities/Name';
import { PVForReleaseEvent } from '@/entities/PV';
import { ReleaseEventSeries } from '@/entities/ReleaseEventSeries';
import { TranslatedString } from '@/entities/TranslatedString';
import { ReleaseEventWebLink } from '@/entities/WebLink';
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

export enum ReleaseEventCategory {
	'Unspecified' = 'Unspecified',
	'AlbumRelease' = 'AlbumRelease',
	'Anniversary' = 'Anniversary',
	'Club' = 'Club',
	'Concert' = 'Concert',
	'Contest' = 'Contest',
	'Convention' = 'Convention',
	'Other' = 'Other',
	'Festival' = 'Festival',
}

@Entity({ tableName: 'release_events' })
export class ReleaseEvent {
	@PrimaryKey()
	id!: number;

	@OneToMany(
		() => ArtistForReleaseEvent,
		(artistLink) => artistLink.releaseEvent,
	)
	artistLinks = new Collection<ArtistForReleaseEvent>(this);

	@Enum(() => ReleaseEventCategory)
	category!: ReleaseEventCategory;

	@Property()
	date?: Date;

	@Property({ type: 'text' })
	description!: string;

	@Property({ length: 32 })
	mainPictureMime?: string;

	@OneToMany(() => ReleaseEventName, (name) => name.releaseEvent)
	names = new Collection<ReleaseEventName>(this);

	@OneToMany(() => PVForReleaseEvent, (pv) => pv.releaseEvent)
	pvs = new Collection<PVForReleaseEvent>(this);

	@ManyToOne()
	series?: Ref<ReleaseEventSeries>;

	@Property()
	seriesNumber!: number;

	/* TODO: @ManyToOne()
	songList?: Ref<SongList>;*/

	@Embedded(() => TranslatedString, { prefix: false })
	translatedName!: TranslatedString;

	/* TODO: @ManyToOne()
	venue?: Ref<Venue>;*/

	@Property({ length: 1000 })
	venueName?: string;

	@OneToMany(() => ReleaseEventWebLink, (webLink) => webLink.releaseEvent)
	webLinks = new Collection<ReleaseEventWebLink>(this);
}
