import { Album } from '@/entities/Album';
import {
	Entity,
	Enum,
	ManyToOne,
	PrimaryKey,
	Property,
	Ref,
} from '@mikro-orm/core';

export enum DiscMediaType {
	Audio = 'Audio',
	Video = 'Video',
}

@Entity({ tableName: 'album_disc_properties' })
export class AlbumDiscProperties {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	album!: Ref<Album>;

	@Property()
	discNumber!: number;

	@Enum(() => DiscMediaType)
	mediaType!: DiscMediaType;

	@Property({ length: 200 })
	name!: string;
}
