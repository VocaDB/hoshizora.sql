import { Tag } from '@/entities/Tag';
import { Entity, ManyToOne, PrimaryKey, Ref } from '@mikro-orm/core';

@Entity({ tableName: 'related_tags' })
export class RelatedTag {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	ownerTag!: Ref<Tag>;

	@ManyToOne()
	linkedTag!: Ref<Tag>;
}
