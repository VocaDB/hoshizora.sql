import { Album } from '@/entities/Album';
import { Entity, ManyToOne, PrimaryKey, Property, Ref } from '@mikro-orm/core';

@Entity({ tableName: 'album_identifiers' })
export class AlbumIdentifier {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	album!: Ref<Album>;

	@Property({ length: 50 })
	value!: string;
}
