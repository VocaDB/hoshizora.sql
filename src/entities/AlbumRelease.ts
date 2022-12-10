import { ReleaseEvent } from '@/entities/ReleaseEvent';
import { Embeddable, ManyToOne, Property, Ref } from '@mikro-orm/core';

@Embeddable()
export class AlbumRelease {
	@Property({ length: 50 })
	catNum?: string;

	@Property()
	day?: number;

	@Property()
	month?: number;

	@ManyToOne()
	releaseEvent?: Ref<ReleaseEvent>;

	@Property()
	year?: number;
}
