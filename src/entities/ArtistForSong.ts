import { Artist } from '@/entities/Artist';
import { Song } from '@/entities/Song';
import { Entity, ManyToOne, PrimaryKey, Property, Ref } from '@mikro-orm/core';

@Entity({ tableName: 'artists_for_songs' })
export class ArtistForSong {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	artist?: Ref<Artist>;

	@Property()
	name?: string;

	@Property()
	roles!: number;

	@ManyToOne()
	song!: Ref<Song>;

	@Property()
	isSupport!: boolean;
}
