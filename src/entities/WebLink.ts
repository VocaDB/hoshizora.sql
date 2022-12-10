import { Album } from '@/entities/Album';
import { Artist } from '@/entities/Artist';
import { ReleaseEvent } from '@/entities/ReleaseEvent';
import { ReleaseEventSeries } from '@/entities/ReleaseEventSeries';
import { Song } from '@/entities/Song';
import { Tag } from '@/entities/Tag';
import {
	Entity,
	Enum,
	ManyToOne,
	PrimaryKey,
	Property,
	Ref,
} from '@mikro-orm/core';

export enum WebLinkCategory {
	Official = 'Official',
	Commercial = 'Commercial',
	Reference = 'Reference',
	Other = 'Other',
}

export abstract class WebLink {
	@PrimaryKey()
	id!: number;

	@Enum(() => WebLinkCategory)
	category!: WebLinkCategory;

	@Property({ length: 512 })
	description!: string;

	@Property({ length: 512 })
	url!: string;

	@Property()
	disabled!: boolean;
}

@Entity({ tableName: 'album_web_links' })
export class AlbumWebLink extends WebLink {
	@ManyToOne()
	album!: Ref<Album>;
}

@Entity({ tableName: 'artist_web_links' })
export class ArtistWebLink extends WebLink {
	@ManyToOne()
	artist!: Ref<Artist>;
}

@Entity({ tableName: 'release_event_web_links' })
export class ReleaseEventWebLink extends WebLink {
	@ManyToOne()
	releaseEvent!: Ref<ReleaseEvent>;
}

@Entity({ tableName: 'release_event_series_web_links' })
export class ReleaseEventSeriesWebLink extends WebLink {
	@ManyToOne()
	releaseEventSeries!: Ref<ReleaseEventSeries>;
}

@Entity({ tableName: 'song_web_links' })
export class SongWebLink extends WebLink {
	@ManyToOne()
	song!: Ref<Song>;
}

@Entity({ tableName: 'tag_web_links' })
export class TagWebLink extends WebLink {
	@ManyToOne()
	tag!: Ref<Tag>;
}
