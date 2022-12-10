import { Album } from '@/entities/Album';
import { Artist } from '@/entities/Artist';
import { ReleaseEvent } from '@/entities/ReleaseEvent';
import { ReleaseEventSeries } from '@/entities/ReleaseEventSeries';
import { Song } from '@/entities/Song';
import { Tag } from '@/entities/Tag';
import { Entity, ManyToOne, PrimaryKey, Property, Ref } from '@mikro-orm/core';

export abstract class Name {
	@PrimaryKey()
	id!: number;

	@Property({ length: 16 })
	language!: string;

	@Property()
	value!: string;
}

@Entity({ tableName: 'album_names' })
export class AlbumName extends Name {
	@ManyToOne()
	album!: Ref<Album>;
}

@Entity({ tableName: 'artist_names' })
export class ArtistName extends Name {
	@ManyToOne()
	artist!: Ref<Artist>;
}

@Entity({ tableName: 'release_event_names' })
export class ReleaseEventName extends Name {
	@ManyToOne()
	releaseEvent!: Ref<ReleaseEvent>;
}

@Entity({ tableName: 'release_event_series_names' })
export class ReleaseEventSeriesName extends Name {
	@ManyToOne()
	releaseEventSeries!: Ref<ReleaseEventSeries>;
}

@Entity({ tableName: 'song_names' })
export class SongName extends Name {
	@ManyToOne()
	song!: Ref<Song>;
}

@Entity({ tableName: 'tag_names' })
export class TagName extends Name {
	@ManyToOne()
	tag!: Ref<Tag>;
}
