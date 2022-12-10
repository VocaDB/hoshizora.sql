import { Album } from '@/entities/Album';
import { ReleaseEvent } from '@/entities/ReleaseEvent';
import { Song } from '@/entities/Song';
import {
	Entity,
	Enum,
	ManyToOne,
	PrimaryKey,
	Property,
	Ref,
} from '@mikro-orm/core';

export enum PVType {
	Original = 'Original',
	Reprint = 'Reprint',
	Other = 'Other',
}

export enum PVService {
	'NicoNicoDouga' = 'NicoNicoDouga',
	'Youtube' = 'Youtube',
	'SoundCloud' = 'SoundCloud',
	'Vimeo' = 'Vimeo',
	'Piapro' = 'Piapro',
	'Bilibili' = 'Bilibili',
	'File' = 'File',
	'LocalFile' = 'LocalFile',
	'Creofuga' = 'Creofuga',
	'Bandcamp' = 'Bandcamp',
}

export abstract class PV {
	@PrimaryKey()
	id!: number;

	@Property({ length: 100 })
	author!: string;

	@Property({ length: 200 })
	name!: string;

	@Property()
	pvId!: string;

	@Enum(() => PVType)
	pvType!: PVType;

	@Enum(() => PVService)
	service!: PVService;

	@Property({ type: 'json' })
	extendedMetadata?: string;

	@Property()
	publishDate?: Date;
}

@Entity({ tableName: 'pvs_for_albums' })
export class PVForAlbum extends PV {
	@ManyToOne()
	album!: Ref<Album>;
}

@Entity({ tableName: 'pvs_for_release_events' })
export class PVForReleaseEvent extends PV {
	@ManyToOne()
	releaseEvent!: Ref<ReleaseEvent>;
}

@Entity({ tableName: 'pvs_for_songs' })
export class PVForSong extends PV {
	@ManyToOne()
	song!: Ref<Song>;
}
