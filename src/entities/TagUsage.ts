import { Album } from '@/entities/Album';
import { Artist } from '@/entities/Artist';
import { ReleaseEvent } from '@/entities/ReleaseEvent';
import { ReleaseEventSeries } from '@/entities/ReleaseEventSeries';
import { Song } from '@/entities/Song';
import { Tag } from '@/entities/Tag';
import { Entity, ManyToOne, PrimaryKey, Property, Ref } from '@mikro-orm/core';

export abstract class TagUsage {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	tag!: Ref<Tag>;

	@Property()
	count!: number;
}

@Entity({ tableName: 'album_tag_usages' })
export class AlbumTagUsage extends TagUsage {
	@ManyToOne()
	album!: Ref<Album>;
}

@Entity({ tableName: 'artist_tag_usages' })
export class ArtistTagUsage extends TagUsage {
	@ManyToOne()
	artist!: Ref<Artist>;
}

@Entity({ tableName: 'release_event_tag_usages' })
export class ReleaseEventTagUsage extends TagUsage {
	@ManyToOne()
	releaseEvent!: Ref<ReleaseEvent>;
}

@Entity({ tableName: 'release_event_series_tag_usages' })
export class ReleaseEventSeriesTagUsage extends TagUsage {
	@ManyToOne()
	releaseEventSeries!: Ref<ReleaseEventSeries>;
}

@Entity({ tableName: 'song_tag_usages' })
export class SongTagUsage extends TagUsage {
	@ManyToOne()
	song!: Ref<Song>;
}
