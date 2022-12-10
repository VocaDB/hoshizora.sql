import { Album } from '@/entities/Album';
import { Artist } from '@/entities/Artist';
import { Entity, ManyToOne, PrimaryKey, Property, Ref } from '@mikro-orm/core';

@Entity({ tableName: 'artists_for_albums' })
export class ArtistForAlbum {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	artist?: Ref<Artist>;

	@ManyToOne()
	album!: Ref<Album>;

	@Property()
	name?: string;

	@Property()
	isSupport!: boolean;

	@Property()
	roles!: number;
}
