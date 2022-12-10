import { ReleaseEventSeriesName } from '@/entities/Name';
import { ReleaseEventCategory } from '@/entities/ReleaseEvent';
import { TranslatedString } from '@/entities/TranslatedString';
import { ReleaseEventSeriesWebLink } from '@/entities/WebLink';
import {
	Collection,
	Embedded,
	Entity,
	Enum,
	OneToMany,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';

@Entity({ tableName: 'release_event_series' })
export class ReleaseEventSeries {
	@PrimaryKey()
	id!: number;

	@Enum(() => ReleaseEventCategory)
	category!: ReleaseEventCategory;

	@Property({ type: 'text' })
	description!: string;

	@Property({ length: 32 })
	mainPictureMime?: string;

	@OneToMany(() => ReleaseEventSeriesName, (name) => name.releaseEventSeries)
	names = new Collection<ReleaseEventSeriesName>(this);

	@Embedded(() => TranslatedString, { prefix: false })
	translatedName!: TranslatedString;

	@OneToMany(
		() => ReleaseEventSeriesWebLink,
		(webLink) => webLink.releaseEventSeries,
	)
	webLinks = new Collection<ReleaseEventSeriesWebLink>(this);
}
