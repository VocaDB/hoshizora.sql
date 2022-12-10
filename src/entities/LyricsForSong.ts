import { Song } from '@/entities/Song';
import {
	Entity,
	Enum,
	ManyToOne,
	PrimaryKey,
	Property,
	Ref,
} from '@mikro-orm/core';

export enum TranslationType {
	Original = 'Original',
	Romanized = 'Romanized',
	Translation = 'Translation',
}

@Entity({ tableName: 'lyrics_for_songs' })
export class LyricsForSong {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	song!: Ref<Song>;

	@Property()
	source!: string;

	@Property({ type: 'text' })
	text!: string;

	@Property({ length: 10 })
	cultureCode!: string;

	@Enum(() => TranslationType)
	translationType!: TranslationType;

	@Property({ length: 500 })
	url!: string;
}
