import { Artist } from '@/entities/Artist';
import { ReleaseEvent } from '@/entities/ReleaseEvent';
import { Entity, ManyToOne, PrimaryKey, Property, Ref } from '@mikro-orm/core';

@Entity({ tableName: 'artists_for_release_events' })
export class ArtistForReleaseEvent {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	artist?: Ref<Artist>;

	@Property()
	name?: string;

	@Property()
	roles!: number;

	@ManyToOne()
	releaseEvent!: Ref<ReleaseEvent>;
}
