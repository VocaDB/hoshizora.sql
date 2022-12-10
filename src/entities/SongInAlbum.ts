import { Album } from '@/entities/Album';
import { Song } from '@/entities/Song';
import { Entity, ManyToOne, PrimaryKey, Property, Ref } from '@mikro-orm/core';

@Entity({ tableName: 'songs_in_albums' })
export class SongInAlbum {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	album!: Ref<Album>;

	@Property()
	discNumber!: number;

	@Property()
	name?: string;

	@ManyToOne()
	song?: Ref<Song>;

	@Property()
	trackNumber!: number;
}
