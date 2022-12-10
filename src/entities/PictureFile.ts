import { Album } from '@/entities/Album';
import { Artist } from '@/entities/Artist';
import { Entity, ManyToOne, PrimaryKey, Property, Ref } from '@mikro-orm/core';

export abstract class PictureFile {
	@PrimaryKey()
	id!: number;

	@Property()
	created!: Date;

	@Property({ length: 32 })
	mime!: string;

	@Property({ length: 200 })
	name!: string;
}

@Entity({ tableName: 'album_picture_files' })
export class AlbumPictureFile extends PictureFile {
	@ManyToOne()
	album!: Ref<Album>;
}

@Entity({ tableName: 'artist_picture_files' })
export class ArtistPictureFile extends PictureFile {
	@ManyToOne()
	artist!: Ref<Artist>;
}
