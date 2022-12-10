import { Artist } from '@/entities/Artist';
import { Entity, Enum, ManyToOne, PrimaryKey, Ref } from '@mikro-orm/core';

export enum ArtistLinkType {
	'CharacterDesigner' = 'CharacterDesigner',
	'Group' = 'Group',
	'Illustrator' = 'Illustrator',
	'Manager' = 'Manager',
	'VoiceProvider' = 'VoiceProvider',
}

@Entity({ tableName: 'artists_for_artists' })
export class ArtistForArtist {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	group!: Ref<Artist>;

	@ManyToOne()
	member!: Ref<Artist>;

	@Enum(() => ArtistLinkType)
	linkType!: ArtistLinkType;
}
